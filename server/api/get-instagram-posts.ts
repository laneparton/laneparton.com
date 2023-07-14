export default defineEventHandler(() => {
    const config = useRuntimeConfig()
    const images = fetchMedia()

    async function fetchMedia() {
        try {
            const mediaIds = await getMediaIds()
            const mediaData = await getMediaInfo(mediaIds)
            return mediaData
        } catch (error) {
            console.error('Error fetching Instagram media:', error)
        }
    }
    
    async function getMediaIds() {
        const response = await $fetch(
            'https://graph.instagram.com/me/media?fields=id&access_token=' + config.instagramToken
        )
        return response.data.map((media) => media.id)
    }
    
    async function getMediaInfo(ids) {
        const promises = ids.map((id) =>
            $fetch(
                `https://graph.instagram.com/${id}?fields=id,media_type,media_url,username,timestamp&access_token=` + config.instagramToken
            )
        )
        const responses = await Promise.all(promises)
        return responses.filter(media => {
            return media.media_type !== "VIDEO"
        })
    }

    return images
})