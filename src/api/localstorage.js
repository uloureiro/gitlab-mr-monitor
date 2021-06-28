import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid'

const localstorage = function(){
    let storeId = function() {
        let id = localStorage.getItem("mr-monitor-store-id")
        if (!id) {
            id = uuidv4()
            localStorage.setItem("mr-monitor-store-id", id)
        } 
        
        return id
    }()

    let sid = function(id) {
        return `${storeId || uuidv4()}_${id}`
    }

    let isUuid = function(value) {
        return uuidValidate(value) && uuidVersion(value) === 4
    }

    let Fetch = function(id) {
        return JSON.parse(localStorage.getItem(sid(id)))
    }

    let FetchByIndex = function(index) {
        return JSON.parse(localStorage.getItem(localStorage.key(index)))
    }

    let FetchAll = function() {
        return new Promise((resolve) => {
            let result = []
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i)
                if (!isUuid(key.slice(0, 36)))
                    continue
    
                let value = localStorage.getItem(key)
                if (value) result.push(JSON.parse(value))
            }
            resolve(result)
        })
    }

    let AddItem = function(item){
        if (!item.id) return
        localStorage.setItem(sid(item.id), JSON.stringify(item))
    }

    let RemoveItem = function(id){
        return new Promise(function(resolve) {
            if(!id) resolve()
            localStorage.removeItem(sid(id))
            resolve()
        })
    }

    let Len = function() {
        return localStorage.length
    }

    return {
        Fetch,
        FetchByIndex,
        FetchAll,
        AddItem,
        RemoveItem,
        Len
    }
}()

export default localstorage