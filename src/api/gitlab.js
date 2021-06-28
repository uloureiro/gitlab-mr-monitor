const gitlab = function(){
    let AuthToken = ""
    const gitlabUrl = "https://gitlab.com"
    let baseUrl = ""
    let apiUrl = `${baseUrl || gitlabUrl}/api/v4`

    let SetAuthToken = function(token) {
        AuthToken = token
    }

    let SetBaseUrl = function(url) {
      baseUrl = url
    }

    let FetchProjects = async function(page) {
      page = !page || isNaN(page) ? "1" : page
      let projectsUrl = `${apiUrl}/projects?simple=true&archived=false&page=${page}`

      return await doRequest(projectsUrl)
    }

    let SearchProjects = async function(criteria, page) {
      page = !page || isNaN(page) ? "1" : page
      let projectsUrl = `${apiUrl}/projects?simple=true&archived=false&page=${page}&search=${criteria}`

      return await doRequest(projectsUrl)
  }

    let FetchMergeRequests = async function(projects) {
      let mrs = []
      for (let i = 0; i < projects.length; i++) {      
        let mrsUrl = `${apiUrl}/projects/${projects[i].id}/merge_requests?state=opened`
        let result = await doRequest(mrsUrl)
        if (result.data.length) mrs.push(result)
      }

      return mrs
    }

    let doRequest = function(url) {
        return new Promise((resolve) => {
            let response = {
                data: {},
                page: "",
                next: "",
                total: ""
            }

            fetch(url, {    
                method: "GET",
                headers: {
                    "PRIVATE-TOKEN": AuthToken
                }
            })
            .then(r => {
                response.page = r.headers.get("X-Page")
                response.next = r.headers.get("X-Next-Page")
                response.previous = r.headers.get("X-Previous-Page")
                response.total_pages = r.headers.get("X-Total-Pages")

                return r.body
            })
            .then(rb => {
              const reader = rb.getReader();
            
              return new ReadableStream({
                start(controller) {
                  function push() {
                    reader.read().then( ({done, value}) => {
                      if (done) {
                        controller.close();
                        return;
                      }
                      controller.enqueue(value);
                      push();
                    })
                  }
            
                  push();
                }
              });
            })
            .then(stream => {
              return new Response(stream, { headers: { "Content-Type": "application/json" } }).json();
            })
            .then(result => {
                response.data = result
                resolve(response)
            });
        })
    }

    return {
        AuthToken,
        Authenticate: SetAuthToken,
        FetchProjects,
        FetchMergeRequests,
        SearchProjects,
        SetBaseUrl
    }
}()

export default gitlab