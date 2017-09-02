let projectLink = null;

let pastLinks = [];

document.addEventListener("contextmenu", function(e) {
	projectLink = [e.target];
	while(projectLink[projectLink.length - 1].parentElement) {
		projectLink.push(projectLink[projectLink.length - 1].parentElement);
	}
});

chrome.runtime.onMessage.addListener(function(req, sender, reply) {
	switch(req.msg) {
		case "STARTING":
			reply({
				author: projectLink.find(el => el.className === "info").children[0].textContent.trim(),
				elID: pastLinks.push(projectLink[0]) - 1
			});
			let el = projectLink[0];
			let circle, after;
			if(!el.querySelector(".circle")) {
				el.appendChild(circle = document.createElement("DIV"));
				circle.className = "circle grey";
				el.appendChild(after = document.createElement("SPAN"));
				after.className = "circle-after grey";
			}
			break;
		case "BAD":
			pastLinks[req.elID].querySelector(".circle").className = "circle red";
			pastLinks[req.elID].querySelector(".circle-after").className = "circle-after red";
			
			pastLinks[req.elID].querySelector(".circle-after").textContent = {
				"AUTHOR": "User made project",
				"LOVED": "Over 100 love-its",
				"NFE": "Not For Everyone",
				"UNSHARED": "Project isn't shared"
			}[req.content];
			break;
		case "GOOD":
			pastLinks[req.elID].querySelector(".circle").className = "circle green";
			pastLinks[req.elID].querySelector(".circle-after").className = "circle-after green";
			
			pastLinks[req.elID].querySelector(".circle-after").textContent = "Good";
			break;
		case "NEUTRAL":
			pastLinks[req.elID].querySelector(".circle").className = "circle orange";
			pastLinks[req.elID].querySelector(".circle-after").className = "circle-after orange";
			
			pastLinks[req.elID].querySelector(".circle-after").textContent = "Check net connection";
			break;
	}
	reply("NEVER RESPONDED");
});