$(document).ready(() => {
    $("#submit").click(() => {
        var radioValue = $("input[name='enable']:checked").val()
        if(radioValue == "1")
        {
            chrome.storage.sync.set({enabled: true})
        }
        else
        {
            chrome.storage.sync.set({enabled: false})
        }
    })
    chrome.storage.sync.get("enabled", (data) => {
        if(data["enabled"])
        {
            console.log("Enabled")
            $("#enabledRadioButton").prop("checked", true)
            $("#disabledRadioButton").prop("checked", false)
        }
        else
        {
            console.log("Disabled")
            $("#disabledRadioButton").prop("checked", true)
            $("#enabledRadioButton").prop("checked", false)
        }
    })
})
