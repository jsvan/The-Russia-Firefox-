const ACTIVE_STORAGE_TAG = 'ACTIVE_STORAGE_TAG';
document.getElementById("Activated").addEventListener('change', activate);
window.addEventListener('load', load_page, false);


function load_page() {

    getActivated().then((activated_val)=> {
        if (activated_val) {
            document.getElementById('Activated').toggleAttribute("checked", true);
        }
    });

}

function activate() {
    getActivated().then( (activated_val) => {
        chrome.storage.sync.set({ACTIVE_STORAGE_TAG: !activated_val}, ()=>{
            document.getElementById('Activated').toggleAttribute("checked", true);
        })
    })
}

function getActivated() {
    return chrome.storage.sync.get([ACTIVE_STORAGE_TAG]).then((response) => {
        return response.ACTIVE_STORAGE_TAG;
    });
}