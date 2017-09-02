chrome.contextMenus.removeAll(function() {
	chrome.contextMenus.create({
		title: "Check if project is eligible",
		contexts: ["link"],
		documentUrlPatterns: ["https://scratch.mit.edu/studios/4228481/comments/"],
		targetUrlPatterns: ["*://scratch.mit.edu/projects/*"],
		onclick: function(info, tab) {
			const project = Number(info.linkUrl.replace(/https?:\/\/scratch\.mit\.edu\/projects\/(\d+).*/i, "$1"));
			
			if(project) {
				chrome.tabs.sendMessage(tab.id, {msg: "STARTING", content: ""}, function(resp) {
					console.log(resp);
					const api = new XMLHttpRequest();
					
					api.open("GET", `https://scratch.mit.edu/api/v1/project/${project}/`);
					api.onreadystatechange = function() {
						if(api.readyState === 4) {
							if(api.status === 200) {
								const data = JSON.parse(api.responseText);
								if(data.creator.username === resp.author) {
									chrome.tabs.sendMessage(tab.id, {msg: "BAD", content: "AUTHOR", elID: resp.elID});
								} else if (Number(data.love_count) > 100) {
									chrome.tabs.sendMessage(tab.id, {msg: "BAD", content: "LOVED", elID: resp.elID});
								} else {
									chrome.tabs.sendMessage(tab.id, {msg: "GOOD", content: "", elID: resp.elID});
								}
							} else {
								// NFE or ProjectNotFound
								const normal = new XMLHttpRequest();
								
								normal.open("GET", `https://scratch.mit.edu/projects/${project}/`);
								normal.onreadystatechange = function() {
									if(normal.readyState === 4) {
										if(normal.status === 200) {
											chrome.tabs.sendMessage(tab.id, {msg: "BAD", content: "NFE", elID: resp.elID});
										} else if (normal.status === 404) {
											chrome.tabs.sendMessage(tab.id, {msg: "BAD", content: "UNSHARED", elID: resp.elID});
										} else {
											chrome.tabs.sendMessage(tab.id, {msg: "NEUTRAL", content: "ERROR", elID: resp.elID});
										}
									}
								}
							}
						}
					};
					api.send();
				});
			}
		}
	});
});