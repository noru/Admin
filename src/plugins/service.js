
export const HOST = process.env.API_ENDPOINT
const AUTH_SERVER = process.env.AUTH_SERVER
const BODY_TEMPLATES = {
  copyMaterial: {
    DestinationAssetURN: '',
    AssetDescription: null,
    DestinationOwner: '', // '' means set to empty, null means no change (use source)
    ReadAccessLevel: null
  }
}

export default {
  install: (Vue, options) => {
    const $h = Vue.http

    Vue.prototype.$s = {
      copyMaterial(source, to, newowner, readaccess, desc) {
        const body = JSON.parse(JSON.stringify(BODY_TEMPLATES.copyMaterial))
        to && (body.DestinationAssetURN = to)
        readaccess && (body.ReadAccessLevel = readaccess)
        desc && (body.AssetDescription = desc)
        newowner && (body.DestinationOwner = newowner)
        console.warn(JSON.stringify(body))
        return $h.post(`${HOST}/Publish/CopyMaterial?sourceUrn=${source}`, body)
      },
      publishMaterial(id, readaccess, newowner) {
        return $h.put(`${HOST}/Publish/PublishMaterial?asset=${id}&readAccess=${readaccess}&owner=${newowner}`)
      },
      getUser() {
        return $h.get(`${HOST}/AdminConsole/CheckAdminUserAuth`)
      },
      getAvatar() {
        return $h.get(`${AUTH_SERVER}/userprofile/v1/users/@me`)
      },
      // todo,
      search() {
        return $h.get(`${HOST}/Asset/CloudSearch?q=${q}&q.parser=structured`)
      }
    }
    Vue.s = Vue.prototype.$s
  }
}
