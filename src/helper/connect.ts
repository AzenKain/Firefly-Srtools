"use client"
import { SendDataThroughProxy, SendDataToServer } from "@/lib/api/api"
import useConnectStore from "@/stores/connectStore"
import useUserDataStore from "@/stores/userDataStore"
import { converterToFreeSRJson } from "./converterToFreeSRJson"
import { pSResponseSchema } from "@/zod"

export const connectToPS = async (): Promise<{ success: boolean, message: string }> => {
    const {
        connectionType,
        privateType,
        serverUrl,
        username,
        password
    } = useConnectStore.getState()

    let urlQuery = serverUrl
    if (!urlQuery.startsWith("http://") && !urlQuery.startsWith("https://")) {
        urlQuery = `http://${urlQuery}`
    }   
    if (connectionType === "FireflyGo") {
        urlQuery = "http://localhost:21000/sync"
    } else if (connectionType === "Other" && privateType === "Server") {
        const response = await SendDataThroughProxy({data: {username, password, serverUrl, data: null, method: "POST"}})
        if (response instanceof Error) {
            return { success: false, message: response.message }
        } else if (response.error) {
            return { success: false, message: response.error }
        } else {
            const parsed = pSResponseSchema.safeParse(response.data)
            if (!parsed.success) {
                return { success: false, message: "Invalid response schema" }
            }
            return { success: true, message: "" }
        }
    } 
    const response = await SendDataToServer(username, password, urlQuery, null)
    if (typeof response === "string") {
        return { success: false, message: response }
    } else if (response.status != 200) {
        return { success: false, message: response.message }
    } else {
        return { success: true, message: "" }
    }
}

export const syncDataToPS = async (): Promise<{ success: boolean, message: string }> => {
    const { 
        connectionType,
        privateType,
        serverUrl,
        username,
        password
    } = useConnectStore.getState()

    const {avatars, battle_type, moc_config, pf_config, as_config, ce_config} = useUserDataStore.getState()
    const data = converterToFreeSRJson(avatars, battle_type, moc_config, pf_config, as_config, ce_config)

    let urlQuery = serverUrl
    if (!urlQuery.startsWith("http://") && !urlQuery.startsWith("https://")) {
        urlQuery = `http://${urlQuery}`
    }   
    if (connectionType === "FireflyGo") {
        urlQuery = "http://localhost:21000/sync"
    } else if (connectionType === "Other" && privateType === "Server") {
        const response = await SendDataThroughProxy({data: {username, password, serverUrl, data, method: "POST"}})
        if (response instanceof Error) {
            return { success: false, message: response.message }
        } else if (response.error) {
            return { success: false, message: response.error }
        } else {
            const parsed = pSResponseSchema.safeParse(response.data)
            if (!parsed.success) {
                return { success: false, message: "Invalid response schema" }
            }
            return { success: true, message: "" }
        }
    } 
    const response = await SendDataToServer(username, password, urlQuery, data)
    if (typeof response === "string") {
        return { success: false, message: response }
    } else if (response.status != 200) {
        return { success: false, message: response.message }
    } else {
        return { success: true, message: "" }
    }
}