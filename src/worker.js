import monitor from "./api/monitor.js"

const worker = function() {
    const notificationMessage = "There are new MRs to review!"
    const interval = 10000//300000 // 5 min
    let previousList = []
    const ActivateWorker = function() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification")
        }
        else if(Notification.permission === "granted") {
            RunMonitor()
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                  RunMonitor()
                }
            })
        }
    }
    const RunMonitor = function() {
        setInterval(async () => {
            let mrs = await monitor.FetchMonitoredMergeRequests()
            if(!mrs) return

            let newList = {}
            let notify = false
            for (let i = 0; i < mrs.length; i++) {
                if (!previousList[mrs[i].id]) {
                    debugger
                    notify = true
                }
                newList[mrs[i].id.toString()] = mrs[i].id
            }
            previousList = newList
            if(notify) { 
                new Notification(notificationMessage)
                PlayNotificationSound()
            }
        }, interval)
    }
    const PlayNotificationSound = function() {
        const audio = new Audio("/notification_decorative-02.wav");
        audio.play()
    }

    return {
        ActivateWorker
    }
}()

export default worker