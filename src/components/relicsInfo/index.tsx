"use client";
import { useCallback, useEffect, useMemo } from "react";
import RelicMaker from "../relicBar";
import { motion } from "framer-motion";
import useUserDataStore from "@/stores/userDataStore";
import { useTranslations } from "next-intl";
import RelicCard from "../card/relicCard";
import useAvatarStore from "@/stores/avatarStore";
import useRelicStore from "@/stores/relicStore";
import useModelStore from '@/stores/modelStore';
import { replaceByParam } from '@/helper';
import useRelicMakerStore from '@/stores/relicMakerStore';
import useAffixStore from '@/stores/affixStore';

export default function RelicsInfo() {
  const { avatars, setAvatars } = useUserDataStore()
  const { avatarSelected } = useAvatarStore()
  const {
    setSelectedRelicSlot,
    setSelectedMainStat,
    setSelectedRelicSet,
    setSelectedRelicLevel,
    setListSelectedSubStats,
    resetHistory,
    resetSubStat,
    listSelectedSubStats,
  } = useRelicMakerStore()
  const { mapSubAffix } = useAffixStore()
  const { isOpenRelic, setIsOpenRelic } = useModelStore()
  const transI18n = useTranslations("DataPage")
 
  const { mapRelicInfo } = useRelicStore()

  const handleShow = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal) {
      setIsOpenRelic(true);
      modal.showModal();
    }
  };

  // Close modal handler
  const handleCloseModal = (modalId: string) => {
    setIsOpenRelic(false);
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpenRelic) {
      handleCloseModal("action_detail_modal");
      return;
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpenRelic) {
        handleCloseModal("action_detail_modal");
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenRelic]);

  const getRelic = useCallback((slot: string) => {
    const avatar = avatars[avatarSelected?.id || ""];
    if (avatar) {
      return avatar.profileList[avatar.profileSelect]?.relics[slot] || null;
    }
    return null;
  }, [avatars, avatarSelected]);

  const handlerDeleteRelic = (slot: string) => {
    const avatar = avatars[avatarSelected?.id || ""];
    if (avatar) {
      delete avatar.profileList[avatar.profileSelect].relics[slot]
      setAvatars({ ...avatars });
    }
  }

  const handlerChangeRelic = (slot: string) => {
    const relic = getRelic(slot)
    setSelectedRelicSlot(slot)
    resetSubStat()
    resetHistory(null)
    if (relic) {
      setSelectedMainStat(relic.main_affix_id.toString())
      setSelectedRelicSet(relic.relic_set_id.toString())
      setSelectedRelicLevel(relic.level)
      const newSubAffixes: { affixId: string, property: string, rollCount: number, stepCount: number }[] = [...listSelectedSubStats];
      relic.sub_affixes.forEach((item, index) => {
        newSubAffixes[index].affixId = item.sub_affix_id.toString();
        newSubAffixes[index].property = mapSubAffix["5"][item.sub_affix_id.toString()]?.property || "";
        newSubAffixes[index].rollCount = item.count || 0;
        newSubAffixes[index].stepCount = item.step || 0;
      })
      setListSelectedSubStats(newSubAffixes)
    } else {
      setSelectedMainStat("")
      setSelectedRelicSet("")
      setSelectedRelicLevel(15)
      const newSubAffixes: { affixId: string, property: string, rollCount: number, stepCount: number }[] = [...listSelectedSubStats];
      newSubAffixes.forEach((item) => {
        item.affixId = ""
        item.property = ""
        item.rollCount = 0
        item.stepCount = 0
      })

      setListSelectedSubStats(newSubAffixes)
    }

    handleShow("action_detail_modal")
  }

  const getEffects = useMemo(() => {
    const avatar = avatars[avatarSelected?.id || ""];
    const relicCount: { [key: string]: number } = {};
    if (avatar) {
      for (const relic of Object.values(avatar.profileList[avatar.profileSelect].relics)) {
        if (relicCount[relic.relic_set_id]) {
          relicCount[relic.relic_set_id]++;
        } else {
          relicCount[relic.relic_set_id] = 1;
        }
      }
    }
    const listEffects: { key: string, count: number }[] = [];
    Object.entries(relicCount).forEach(([key, value]) => {
      if (value >= 2) {
        listEffects.push({ key: key, count: value });
      }
    });
    return listEffects;
  }, [avatars, avatarSelected]);


  return (
    <div className="max-h-[77vh] min-h-[50vh] overflow-y-scroll overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Section - Items Grid */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-xl p-6 shadow-lg">
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-base-content">
                <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                {transI18n("relics")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {["1", "2", "3", "4", "5", "6"].map((item, index) => (
                  <div key={index} className="relative group">
                    <div
                      onClick={() => {
                        handlerChangeRelic(item)
                      }}
                      className="cursor-pointer"
                    >
                      <RelicCard
                        slot={item}
                        avatarId={avatarSelected?.id || ""}
                      />
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlerChangeRelic(item)
                        }}
                        className="btn btn-info p-1.5 rounded-full shadow-lg transition-colors duration-200"
                        title={transI18n("changeRelic")}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>

                      {getRelic(item) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm(`${transI18n("deleteRelicConfirm")} ${item}?`)) {
                              handlerDeleteRelic(item)
                            }
                          }}
                          className="btn btn-error p-1.5 rounded-full shadow-lg transition-colors duration-200"
                          title={transI18n("deleteRelic")}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Stats and Set Effects */}
          <div className="space-y-6">

            {/* Set Effects Panel */}
            <div className="bg-base-100 rounded-xl p-6 shadow-lg">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-base-content">
                <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                {transI18n("setEffects")}
              </h3>

              <div className="space-y-6">
                {getEffects.map((setEffect, index) => {
                  const relicInfo = mapRelicInfo[setEffect.key];
                  if (!relicInfo) return null;
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="font-bold text-warning"
                          dangerouslySetInnerHTML={{
                            __html: replaceByParam(
                              relicInfo.Name,
                              []
                            )
                          }}
                        />
                        {setEffect.count && (
                          <span className={`text-sm text-info`}>
                            ({setEffect.count})
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 pl-4">
                        {Object.entries(relicInfo.RequireNum).map(([requireNum, value]) => {
                          if (Number(requireNum) > Number(setEffect.count)) return null;
                          return (
                            <div key={requireNum} className="space-y-1">
                              <div className={`font-medium text-success`}>
                                {requireNum}-PC:
                              </div>
                              <div
                                className="text-sm text-base-content/80 leading-relaxed pl-4"
                                dangerouslySetInnerHTML={{
                                  __html: replaceByParam(
                                    value.Desc,
                                    value.ParamList || []
                                  )
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog id="action_detail_modal" className="modal lg:backdrop-blur-sm z-10">
        <div className="modal-box w-11/12 max-w-7xl bg-base-100 text-base-content border border-purple-500/50 shadow-lg shadow-purple-500/20">
          <div className="sticky top-0 z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="btn btn-circle btn-md absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={() => handleCloseModal("action_detail_modal")}
            >
              ✕
            </motion.button>
          </div>
          <RelicMaker />
        </div>

      </dialog>
    </div>
  );
}
