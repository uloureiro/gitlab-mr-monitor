import localstorage from "./localstorage.js"
import gitlab from "./gitlab.js"

const monitor = function() {
    const FetchMonitoredMergeRequests = async function() {
        let mrs = []
        let projects = await localstorage.FetchAll()
        let projectsMrs = await gitlab.FetchMergeRequests(projects)
        for (let i = 0; i < projectsMrs.length; i++) {
          let project = localstorage.Fetch(projectsMrs[i].data[0].project_id)
          for (let ii = 0; ii < projectsMrs[i].data.length; ii++) {
            const mr = projectsMrs[i].data[ii];
            
            mr.project_name = project.name
            mr.project_avatar_url = project.avatar_url
            mrs.push(mr)
          }
          return mrs
        }
    }

    return {
        FetchMonitoredMergeRequests
    }
}()

export default monitor