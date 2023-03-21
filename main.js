//
let Cookie = document.querySelector("#Cookie");
let Debris = document.querySelector("#debris");
let MenuBar = document.querySelector(".menuBar");
let CookieImg = document.querySelector(".cookieImg");
let BakeryName = document.querySelector(".BakeryName");
let PerSecondDisplay = document.querySelectorAll(".PerSecond");
let CookieDisplay = document.querySelectorAll(".CookiesDisplay");
let Partitions = {
	SettingsPartition: document.querySelector(".SettingsPartition"),
    AchievementPartition: document.querySelector(".AchievementPartition"),
    StorePartition: document.querySelector(".StorePartition")
};
let Upgrades = {
	Cursor: {
    	Cost: 5,
        Amount: 0,
        Description: "Extra 1 Cookies Per Click",  
        Icon: "https://freesvg.org/img/Black-Pixel-Mouse-Cursor-Arow-Fixed.png",
		CookiesPerSec: 0,
        PerClick: 1
    },
    IronCursor: {
    	Cost: 100,
        Amount: 0,
        Description: "Extra 10 Cookies Per Click",  
        Icon: "https://freesvg.org/img/Black-Pixel-Mouse-Cursor-Arow-Fixed.png",
		CookiesPerSec: 0,
        PerClick: 10
    },
    DiamondCursor: {
    	Cost: 2500,
        Amount: 0,
        Description: "Extra 25 Cookies Per Click",  
        Icon: "https://freesvg.org/img/Black-Pixel-Mouse-Cursor-Arow-Fixed.png",
		CookiesPerSec: 0,
        PerClick: 25
    }
};

let Achievments = {
	"Novice": {
    	Description: "Obtain 100 Cookies",
        Requirement: 5
    },
    CookieSpammer: {
    	Description: "Obtain 500 Cookies",
        Requirement: 500
    },
    CookieMonster: {
    	Description: "Obtain 5,000 Cookies",
        Requirement: 5000
    },
    CookieGod: {
    	Description: "Obtain 25,000 Cookies",
        Requirement: 25000,
    }
};
let UpgradesList = ["Cursor","IronCursor","DiamondCursor"];

let ToolTip;

let Game = { 
	Cookies: 0,
    CookiesMultiplier: 1,
    CookiesPerSecond: 0,
    CookiesDebounce: 0,
    CookiesDelay: 300,
  	Abbreviations: ["K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","De"],
    Mouse: {
		X:0,
        Y:0,
	},
    Settings: {
    	Name: ""    
    },
    Achievments: [
    
    ],
};

let SettingCallbacks = {
	Name: function(input) {
        Game.Settings.Name = input;
        BakeryName.innerHTML = `${input}s Bakery`;
    }
};


function Notification(Header,Paragraph) {
    let Notif = document.newElement("div");
    
    Notif.innerHTML = `
      <h2> New Achievment </h2>
                <p> Novice </p>
    `;
    
    setTimeout(function() {Notif.remove();},4000);
}

function Abbreviate() {
    
}

function CookiesChanged() {
    CookieDisplay.forEach(function(element,k) {
        element.innerHTML = `${Game.Cookies} Cookies`;
    });
    
    for (let Name in Achievments) {
        if (!(Game.Achievments.indexOf(Name))) {} else {
            let Data = Achievments[Name];
    		let Req = Data.Requirement;    
            if (Req <= Game.Cookies) {
            	Game.Achievments.push(Name);
                let NotificationDiv = document.createElement("div");
                NotificationDiv.setAttribute("class","notification");
                NotificationDiv.innerHTML = `     
                <h2> New Achievment </h2>
                <p> ${Name} </p>
   `;
                console.log("Spawned");
                document.querySelector("body").appendChild(NotificationDiv);
                setTimeout(function(){NotificationDiv.remove();},3900);
                
                let AchievmentList = document.querySelector(".AchievmentList");
                let Inner = ``;
                
                Game.Achievments.forEach(function(Name2) {
                    let Data2 = Achievments[Name2];
                	Inner = Inner + `<li> <h3> ${Name2} </h3> <p> ${Data2.Description} </p> </li>`;
                });
                
                AchievmentList.innerHTML = Inner;
            }
        }
        
    }
}

function CreateClickEffect(txt) {
	let popup = document.createElement("p");  
    popup.innerHTML = "+"+txt;
    popup.setAttribute("class","popup");
    
    popup.style.top = Game.Mouse.Y+"px";
    popup.style.left = Game.Mouse.X+"px";
    
    let x = Game.Mouse.X;
    let y = Game.Mouse.Y;
    let i =0;
    
    let id;  id = setInterval(function() {
    	if (i >= 100) {
			clearInterval(id);
        }
        
        y -= 1;
        i++;
      	popup.style.top = y+"px";
    },10);
    
    console.log(Game.Mouse);
    
    setTimeout(function() {popup.remove();},950);
    
    Debris.appendChild(popup);
}


function Click() {  
    if ((Game.CookiesDebounce + Game.CookiesDelay) < Date.now()) {
     	Game.CookiesDebounce = Date.now();	   
        Game.Cookies += 1 * Game.CookiesMultiplier;
        CookieImg.setAttribute("class","cookieImg ClickedAnimation");
        setTimeout(function() {CookieImg.setAttribute("class","cookieImg");},300);
        CreateClickEffect(1 * Game.CookiesMultiplier);
        CookiesChanged();
    }
}

function UpdateMulti() {
    Game.CookiesPerSecond = 0;
    Game.CookiesMultiplier = 1;
    UpgradesList.forEach(function(Name) {
    	let Data = Upgrades[Name];
        Game.CookiesPerSecond += (Data.Amount * Data.CookiesPerSec);
        Game.CookiesMultiplier += (Data.Amount * Data.PerClick);
    });
    
    PerSecondDisplay.forEach(function(Element) {
    	Element.innerHTML = `${Game.CookiesPerSecond} Cookies per second`;    
    });
}

function MouseEnter(Name,Data) {
	let NewToolTip = document.createElement("div");
    NewToolTip.setAttribute("class","tooltip");
    
    NewToolTip.innerHTML = `
    <h1> ${Name} </h1>
    <p> ${Data.Description} </p>
    `;
    
    
    Debris.appendChild(NewToolTip);
    ToolTip = NewToolTip;
}

function MouseLeave() {
	if (ToolTip) {
    	ToolTip.remove();   
        ToolTip = false;
    }
}

function MenuManager() {
	MenuBar.children.forEach(function(elem,_) {
        elem.children.forEach(function(v,k) {          
   		 	v.onclick = function() {
            	let type = v.getAttribute("type");
            
           		Partitions.SettingsPartition.style.display = "none";
            	Partitions.AchievementPartition.style.display = "none";
           		Partitions[type].style.display = "block";
        };
        });
    });    
}
MenuManager();

function SettingsManager() {
    let SettingInputs = document.querySelectorAll(".SettingValue");
    let SettingButtons = document.querySelectorAll(".SettingButton");
    let Settings = {};
    
    SettingInputs.forEach(function(Element) {
    	let Type = Element.getAttribute("setting");
        
        if (!Settings[Type]) {
            Settings[Type] = {Input: Element};
        }
    });
    
    SettingButtons.forEach(function(Element) {
    	let Type = Element.getAttribute("setting");
        let Tabl = Settings[Type];
        
        Element.onclick = function() {
        	let Input = Tabl.Input.value;    
            SettingCallbacks[Type](Input);
        };
    });
    
}

SettingsManager();

function StoreManager() {
	UpgradesList.forEach(function(Name,k){
        let v = Upgrades[Name];
    	let StoreItem = `
                                <div class="StoreItem" Item="${Name}"}> 
                            <img class="StoreIcon" src="${v.Icon}"> 
                            <div style="text-align:left; font-size: 18px; width:100%;">
                                <h2 style="margin-bottom: 0px"> ${Name} </h2>
                                <div style="display:flex"> <img src="http://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/0b34613dea2ac23.png" style="width:22px;height:22px;"> <h4 style="margin-top: 0px" class="${Name+"Stats"}"> <span style="color:yellow;">${v.Cost}</span> (0) </h4> </div>
                                
                            </div>
                        </div>
        `;
        Partitions.StorePartition.insertAdjacentHTML("beforeend",StoreItem);
    });
}

StoreManager();

document.querySelectorAll(".StoreItem").forEach(function(Item) {
    let Type = Item.getAttribute("Item");
	Item.onclick = function() {
        let Data = Upgrades[Type];
        let Cost = Data.Cost * (Data.Amount + 1);
        
        if (Cost <= Game.Cookies) {
        	Game.Cookies -= Cost;
            Data.Amount += 1;
            UpdateMulti();
            CookiesChanged();
            
            let StatsLabel = document.querySelector("."+Type+"Stats");
            StatsLabel.innerHTML = `<span style="color:yellow;">${Data.Cost*(Data.Amount+1)}</span> (${Data.Amount})`;
        }
    };
   Item.onmouseenter = function() {MouseEnter(Type,Upgrades[Type]);};
    Item.onmouseleave = MouseLeave;
});

function onMouseUpdate(e) {
    Game.Mouse.X = e.pageX;
    Game.Mouse.Y = e.pageY;
    
    if (ToolTip) {
        ToolTip.style.top = (Game.Mouse.Y-50)+"px";
        //ToolTip.style.left = "39vw";
                ToolTip.style.left = (Game.Mouse.x-50)+"px";
    }
}

Cookie.onclick = Click;
//Cookie.onmouseenter = MouseEnter;
//Cookie.onmouseleave = MouseLeave;
document.addEventListener('mousemove', onMouseUpdate);
