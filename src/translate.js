const DEBUG = true;
const RE_FIND = /(?<![aA-] |[tT]he |\b.*[’']s |[mM]other |[-])[rR]ussia(?![ns-])/g;
const RE_UPPER_THE = /(^|[.!?]\s|["'‘“])the Russia/g;
const ACTIVE_STORAGE_TAG = 'ACTIVE_STORAGE_TAG';
let SEARCHED = false;
let TOTAL = 0;
// Was really having trouble with new URL loading new pages not proccing the content script. Nothing worked!
//That is until I found Minj on stackoverflow. Thanks for the code! https://stackoverflow.com/a/34607278

run_if_active();


function run_if_active() {

	browser.storage.sync.get([ACTIVE_STORAGE_TAG]).then((response) => {
		if (response.ACTIVE_STORAGE_TAG) {
			initMO();
			setTimeout(() => {
				if (!SEARCHED) {
					console.log('HARD SEARCHING...')
					const guy = document.createElement("span");
					document.body.appendChild(guy);
					SEARCHED = true;
				}
			}, 1000)
		}
	});
}

function initMO(root = document.body) {
	console.log("In mutator")
	SEARCHED = false;
	let MO = window.MutationObserver || window.WebKitMutationObserver;
	let observer = new MO(function(mutations) {
		observer.disconnect();
		console.log("NEW GROUP:")
		console.log(mutations.length)
		sloppy_clear_duplicate_muts(mutations)
		console.log(mutations)
		mutations.forEach(function(mutation){
			if (mutation === null){
				return;
			}
			let node = mutation.target;
			console.log("SEARCHING:")
			if (node.textContent.length > 75){
				SEARCHED = true;
			}

			search(node);
		});
		observe();
	});
	let opts = { characterData: true, childList: true, subtree: true };
	let observe = function() {
		observer.takeRecords();
		//setTimeout(()=>{}, 400);
		observer.observe(root, opts);
	};
	observe();
}

//n^2 but it's okay bc it prevents repeat tree traversals and I think the
// array length is short, like <20 usually. Dunno though.
function sloppy_clear_duplicate_muts(mutations) {
		for (let i = 0; i < mutations.length; i++){
			if (!mutations[i]){
				continue;
			}
			for (let j = i + 1; j < mutations.length; j++){
				if (!mutations[j]){
					continue;
				}
				if (mutations[i].target === mutations[j].target){
					mutations[j] = null;
				}
			}
		}
}

function search(parent = document.body){
    for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
        if (['SCRIPT','STYLE', 'CODE', 'BUTTON', 'META', "NOSCRIPT"].indexOf(parent.tagName) >= 0) {
			continue;
		}
        if (parent.nodeType === Node.TEXT_NODE) {
			edit(parent);
		} else {
			search(parent);
		}
    }
}

function edit(node) {
	let text = node.textContent;
	if (text && text.includes("ussia")) {
		text = text.replaceAll(RE_FIND, "the Russia");
		text = text.replaceAll(RE_UPPER_THE, "$1The Russia");
		node.textContent = text;
		TOTAL += 1;
		console.log(text)
	}
}

function jprint(s) {
	if (DEBUG) {
		console.log(s);
	}
}

