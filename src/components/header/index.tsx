"use client"
import { connectToPS, downloadJson, syncDataToPS } from "@/helper";
import { converterToFreeSRJson } from "@/helper/converterToFreeSRJson";
import { useChangeTheme } from "@/hooks/useChangeTheme";
import { listCurrentLanguage } from "@/lib/constant";
import useLocaleStore from "@/stores/localeStore";
import useUserDataStore from "@/stores/userDataStore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EnkaImport from "../importBar/enka";
import useModelStore from "@/stores/modelStore";
import FreeSRImport from "../importBar/freesr";
import { toast } from "react-toastify";
import { micsSchema } from "@/zod";
import useConnectStore from "@/stores/connectStore";
import useGlobalStore from "@/stores/globalStore";
import MonsterBar from "../monsterBar";

const themes = [
    { label: "Winter" },
    { label: "Night" },
    { label: "Cupcake" },
    { label: "Coffee" },
];

export default function Header() {
    const { changeTheme } = useChangeTheme()
    const { locale, setLocale } = useLocaleStore()
    const { 
        avatars, 
        battle_type, 
        setAvatars, 
        setBattleType,
        moc_config,
        pf_config,
        as_config,
        ce_config,
        setMocConfig,
        setPfConfig,
        setAsConfig,
        setCeConfig,
    } = useUserDataStore()

    const router = useRouter()
    const transI18n = useTranslations("DataPage")
    const { 
        setIsOpenImport, 
        isOpenImport, 
        setIsOpenMonster, 
        isOpenMonster,
        setIsOpenConnect,
        isOpenConnect
    } = useModelStore()

    const [message, setMessage] = useState({ text: '', type: '' });
    const [importModal, setImportModal] = useState("enka");
    const {
        connectionType,
        privateType,
        serverUrl,
        username,
        password,
        setConnectionType,
        setPrivateType,
        setServerUrl,
        setUsername,
        setPassword
    } = useConnectStore()
    const { isConnectPS, setIsConnectPS } = useGlobalStore()

    useEffect(() => {

        const cookieLocale = document.cookie.split("; ")
            .find((row) => row.startsWith("MYNEXTAPP_LOCALE"))
            ?.split("=")[1];

        if (cookieLocale) {
            if (!listCurrentLanguage.hasOwnProperty(cookieLocale)) {
                setLocale("en")
            } else {
                setLocale(cookieLocale)
            }

        } else {
            let browserLocale = navigator.language.slice(0, 2);

            if (!listCurrentLanguage.hasOwnProperty(browserLocale)) {
                browserLocale = "en"
            }
            setLocale(browserLocale);
            document.cookie = `MYNEXTAPP_LOCALE=${browserLocale};`
            router.refresh()
        }
    }, [router, setLocale])

    const changeLocale = (newLocale: string) => {
        setLocale(newLocale)
        document.cookie = `MYNEXTAPP_LOCALE=${newLocale};`
        router.refresh()
    }

    const handleShow = (modalId: string) => {
        const modal = document.getElementById(modalId) as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    };

    // Close modal handler
    const handleCloseModal = (modalId: string) => {
        const modal = document.getElementById(modalId) as HTMLDialogElement | null;
        if (modal) {
            modal.close()
        }
    };

    // Handle ESC key to close modal
    useEffect(() => {
        if (!isOpenImport) {
            handleCloseModal("import_modal");
            return;
        }
        if (!isOpenMonster) {
            handleCloseModal("monster_modal");
            return;
        }
        if (!isOpenConnect) {
            handleCloseModal("connect_modal");
            return;
        }
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseModal("connect_modal");
                handleCloseModal("import_modal");
                handleCloseModal("monster_modal");
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [isOpenImport, isOpenMonster, isOpenConnect]);

    const handleImportDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) {
            toast.error(transI18n("pleaseSelectAFile"))

            return
        }
        if (!file.name.endsWith(".json") || file.type !== "application/json") {
            toast.error(transI18n("fileMustBeAValidJsonFile"))
            return
        }

        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    const parsed = micsSchema.parse(data)
                    setAvatars(parsed.avatars)
                    setBattleType(parsed.battle_type)
                    setMocConfig(parsed.moc_config)
                    setPfConfig(parsed.pf_config)
                    setAsConfig(parsed.as_config)
                    setCeConfig(parsed.ce_config)
                    toast.success(transI18n("importDatabaseSuccess"))
                } catch  {
                    toast.error(transI18n("fileMustBeAValidJsonFile"))
                }
            };
            reader.readAsText(file);
        }

    };

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-3 py-1">
            <div className="navbar-start">
                {/* Mobile menu dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm lg:hidden hover:bg-base-200 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-md border border-base-200"
                    >
                        <li>
                            <details>
                                <summary className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium w-full">{transI18n("loadData")}</summary>
                                <ul className="p-2">
                                    <li><a onClick={() => {
                                        setImportModal("freesr")
                                        setIsOpenImport(true)
                                        handleShow("import_modal")
                                    }}>{transI18n("freeSr")}</a></li>
                                    <li>
                                        <>
                                            <input
                                                type="file"
                                                accept="application/json"
                                                id="database-data-upload"
                                                className="hidden"
                                                onChange={handleImportDatabase}
                                            />
                                            <button
                                                onClick={() => document.getElementById('database-data-upload')?.click()}
                                            >
                                                {transI18n("database")}
                                            </button>
                                        </>
                                    </li>
                                    <li><a onClick={() => {
                                        setImportModal("enka")
                                        setIsOpenImport(true)
                                        handleShow("import_modal")
                                    }}>{transI18n("enka")}</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium">{transI18n("exportData")}</summary>
                                <ul className="p-2">
                                    <li><a onClick={() => downloadJson("freesr-data", converterToFreeSRJson(avatars, battle_type, moc_config, pf_config, as_config, ce_config))}>{transI18n("freeSr")}</a></li>
                                    <li><a onClick={() => downloadJson("database-data", { avatars: avatars, battle_type: battle_type, moc_config: moc_config, pf_config: pf_config, as_config: as_config, ce_config: ce_config })}>{transI18n("database")}</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <button
                                className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium"
                                onClick={() => {
                                    setIsOpenConnect(true)
                                    handleShow("connect_modal")
                                }}
                            >
                                {transI18n("connectSetting")}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setIsOpenMonster(true)
                                    handleShow("monster_modal")
                                }}
                                className="disabled px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium"
                            >
                                {transI18n("monsterSetting")}
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Logo */}

                <a className="hidden sm:grid sm:grid-cols-1 items-start text-left gap-0 hover:scale-105 px-2">
                    <h1 className="text-xl font-bold">
                        <span className="text-emerald-500">Firefly Sr</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-orange-500 to-red-500">
                            Tools
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500">By Kain</p>
                </a>

            </div>

            {/* Desktop navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-1">
                    <li>
                        <details>
                            <summary className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium">{transI18n("loadData")}</summary>
                            <ul className="p-2">
                                <li><a onClick={() => {
                                    setImportModal("freesr")
                                    setIsOpenImport(true)
                                    handleShow("import_modal")
                                }}>{transI18n("freeSr")}</a></li>
                                <li>
                                    <>
                                        <input
                                            type="file"
                                            accept="application/json"
                                            id="database-data-upload"
                                            className="hidden"
                                            onChange={handleImportDatabase}
                                        />
                                        <button
                                            onClick={() => document.getElementById('database-data-upload')?.click()}
                                        >
                                            {transI18n("database")}
                                        </button>
                                    </>
                                </li>
                                <li><a onClick={() => {
                                    setImportModal("enka")
                                    setIsOpenImport(true)
                                    handleShow("import_modal")
                                }}>{transI18n("enka")}</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium">{transI18n("exportData")}</summary>
                            <ul className="p-2">
                                <li><a onClick={() => downloadJson("freesr-data", converterToFreeSRJson(avatars, battle_type, moc_config, pf_config, as_config, ce_config))}>{transI18n("freeSr")}</a></li>
                                <li><a onClick={() => downloadJson("database-data", { avatars: avatars, battle_type: battle_type, moc_config: moc_config, pf_config: pf_config, as_config: as_config, ce_config: ce_config })}>{transI18n("database")}</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <button
                            className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium"
                            onClick={() => {
                                setIsOpenConnect(true)
                                handleShow("connect_modal")
                            }}
                        >
                            {transI18n("connectSetting")}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                setIsOpenMonster(true)
                                handleShow("monster_modal")
                            }}
                            className="px-3 py-2 hover:bg-base-200 rounded-md transition-all duration-200 font-medium"
                        >
                            {transI18n("monsterSetting")}
                        </button>
                    </li>
                </ul>
            </div>


            {/* Right side items */}
            <div className="navbar-end gap-2">
                <div className="px-2">
                    <div className="flex items-center space-x-2 p-1.5 rounded-full shadow-md">
                        <div className={`hidden lg:block text-sm italic ${isConnectPS ? 'text-green-500' : 'text-red-500'}`}>
                            {isConnectPS ? transI18n("connected") : transI18n("unconnected")}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${isConnectPS ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                </div>

                {/* Language selector - REFINED */}
                <div className="dropdown dropdown-end">
                    <div className="flex items-center gap-1 border border-base-300 rounded text-sm px-1.5 py-0.5 hover:bg-base-200 cursor-pointer transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                        </svg>

                        <select
                            className="outline-none bg-base-200 cursor-pointer text-sm pr-0"
                            value={locale}
                            onChange={(e) => changeLocale(e.target.value)}
                        >
                            {Object.entries(listCurrentLanguage).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div title="Change Theme" className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm hover:bg-base-200 transition-all duration-200 px-2">
                        <svg
                            width={16}
                            height={16}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                        </svg>
                        <svg
                            width="10px"
                            height="10px"
                            className="ml-1 h-2 w-2 fill-current opacity-60"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2048 2048"
                        >
                            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                        </svg>
                    </div>

                    <div
                        tabIndex={0}
                        className="dropdown-content bg-base-100 text-base-content rounded-lg top-px overflow-y-auto border border-base-200 shadow-md mt-12"
                    >
                        <ul className="menu w-40 p-1">
                            {themes.map((theme) => (
                                <li
                                    key={theme.label}
                                    onClick={() => {
                                        if (changeTheme) changeTheme(theme.label.toLowerCase());
                                    }}
                                >
                                    <button
                                        className="gap-2 px-2 py-1.5 hover:bg-base-200 rounded text-sm transition-all duration-200"
                                        data-set-theme={theme.label.toLowerCase()}
                                        data-act-class="[&_svg]:visible"
                                    >
                                        <div
                                            data-theme={theme.label.toLowerCase()}
                                            className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded p-1 shadow-sm"
                                        >
                                            <div className="bg-base-content size-1 rounded-full" />
                                            <div className="bg-primary size-1 rounded-full" />
                                            <div className="bg-secondary size-1 rounded-full" />
                                            <div className="bg-accent size-1 rounded-full" />
                                        </div>
                                        <div className="text-sm">{theme.label}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* GitHub Link */}
                <Link
                    className='hidden sm:flex btn btn-ghost btn-sm btn-circle bg-white/20 hover:bg-white/100 transition-all duration-200 items-center justify-center'
                    href={"https://github.com/AzenKain/Firefly-Srtools"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                    </svg>
                </Link>
            </div>

            <dialog id="connect_modal" className="modal sm:modal-middle backdrop-blur-sm">
                <div className="modal-box w-11/12 max-w-7xl bg-base-100 text-base-content border border-purple-500/50 shadow-lg shadow-purple-500/20">
                    <div className="sticky top-0 z-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="btn btn-circle btn-md absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={() => {
                                setIsOpenConnect(false)
                                handleCloseModal("connect_modal")
                            }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                        <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                            {"PS Connection"}
                        </h3>
                    </div>

                    <div className="px-6 py-4">
                        {/* Select connection type */}
                        <div className="form-control grid grid-cols-1 w-full mb-6">
                            <label className="label">
                                <span className="label-text font-semibold text-purple-300">{transI18n("connectionType")}</span>
                            </label>
                            <select
                                className="select w-full select-bordered border-purple-500/30 focus:border-purple-500 bg-base-200 mt-1"
                                value={connectionType}
                                onChange={(e) => setConnectionType(e.target.value)}
                            >
                                <option value="FireflyGo">FireflyGo</option>
                                <option value="Other">{transI18n("other")}</option>
                            </select>
                        </div>

                        {/* Show host/port if Other */}
                        {connectionType === "Other" && (
                            <div className="flex flex-col md:space-x-4 mb-6 gap-2">
                                <div className="form-control w-full mb-4 md:mb-0">
                                    <label className="label">
                                        <span className="label-text font-semibold text-purple-300">{transI18n("serverUrl")}</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={transI18n("placeholderServerUrl")}
                                        className="input input-bordered w-full border-purple-500/30 focus:border-purple-500 bg-base-200 mt-1"
                                        value={serverUrl}
                                        onChange={(e) => setServerUrl(e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full mb-4 md:mb-0">
                                    <label className="label">
                                        <span className="label-text font-semibold text-purple-300">{transI18n("privateType")}</span>
                                    </label>
                                    <select
                                        className="select w-full select-bordered border-purple-500/30 focus:border-purple-500 bg-base-200 mt-1"
                                        value={privateType}
                                        onChange={(e) => setPrivateType(e.target.value)}
                                    >
                                        <option value="Local">{transI18n("local")}</option>
                                        <option value="Server">{transI18n("server")}</option>
                                    </select>
                                </div>

                                <div className="form-control w-full mb-4 md:mb-0">
                                    <label className="label">
                                        <span className="label-text font-semibold text-purple-300">{transI18n("username")}</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={transI18n("placeholderUsername")}
                                        className="input input-bordered w-full border-purple-500/30 focus:border-purple-500 bg-base-200 mt-1"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full mb-4 md:mb-0">
                                    <label className="label">
                                        <span className="label-text font-semibold text-purple-300">{transI18n("password")}</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={transI18n("placeholderPassword")}
                                        className="input input-bordered w-full border-purple-500/30 focus:border-purple-500 bg-base-200 mt-1"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' :
                                message.type === 'error' ? 'alert-error' : 'alert-info'
                                } mb-6`}>
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mb-2">
                            <div className="mb-4 sm:mb-0">
                                <span className="text-md mr-2">{transI18n("status")}:</span>
                                <span className={`badge ${isConnectPS ? 'badge-success' : 'badge-error'} badge-lg`}>
                                    {isConnectPS ? transI18n("connected") : transI18n("unconnected")}
                                </span>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={
                                        async () => {
                                            const response = await connectToPS()
                                            if (response.success) {
                                                setIsConnectPS(true)
                                                setMessage({
                                                    type: "success",
                                                    text: transI18n("connectedSuccess")
                                                })
                                            } else {
                                                setIsConnectPS(false)
                                                setMessage({
                                                    type: "error",
                                                    text: response.message
                                                })
                                            }
                                        }
                                    }
                                    className={`btn btn-primary`}

                                >
                                    {transI18n("connectPs")}
                                </button>
                                {isConnectPS && (
                                    <button
                                        onClick={
                                            async () => {
                                                const response = await syncDataToPS()
                                                if (response.success) {
                                                    setMessage({
                                                        type: "success",
                                                        text: transI18n("syncSuccess")
                                                    })
                                                } else {
                                                    setMessage({
                                                        type: "error",
                                                        text: `${transI18n("syncFailed")}: ${response.message}`
                                                    })
                                                }
                                            }
                                        }
                                        className={`btn btn-success`}
                                    >
                                        {transI18n("sync")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>


            <dialog id="import_modal" className="modal backdrop-blur-sm">
                <div className="modal-box w-11/12 max-w-max bg-base-100 text-base-content border border-purple-500/50 shadow-lg shadow-purple-500/20">
                    <div className="sticky top-0 z-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="btn btn-circle btn-md absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={() => {
                                handleCloseModal("import_modal")
                                setIsOpenImport(false)
                            }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                        <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                            {transI18n("importSetting")}
                        </h3>
                    </div>

                    {importModal === "enka" && <EnkaImport />}
                    {importModal === "freesr" && <FreeSRImport />}
                </div>
            </dialog>

            <dialog id="monster_modal" className="modal sm:backdrop-blur-sm md:backdrop-blur-none">
                <div className="modal-box w-11/12 max-w-max bg-base-100 text-base-content border border-purple-500/50 shadow-lg shadow-purple-500/20">
                    <div className="sticky top-0 z-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="btn btn-circle btn-md absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={() => {
                                handleCloseModal("monster_modal")
                                setIsOpenMonster(false)
                            }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                        <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                            {transI18n("monsterSetting")}
                        </h3>
                    </div>
                    <MonsterBar />
                </div>
            </dialog>

        </div>
    )
}