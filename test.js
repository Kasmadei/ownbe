let previousUrl = "";
const observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    console.log(`visited url ${previousUrl}`);
    // postData("http://localhost:6420/visitedUrl", {
    //   visitedUrl: location.href,
    // }).then((data) => {
    //   console.log("Server response > > >", data);
    //   createPopup();
    // });
  }
});

const id = document.getElementById("notify-script").getAttribute("data-id");

console.log("Script called for id: " + id);

window.onload = function () {
  const defaultAnimation = newSheet();
  defaultAnimation.insertRule(
    `@keyframes slideInFromLeft {
        0% {
          transform: translateY(100%);
        }
        100% {
          transform: translateY(0);
        }
      }`,
    0
  );
};

const newSheet = () => {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  // Add the <style> element to the page, all created css props via this way will be automatically added to page
  document.head.appendChild(style);
  return style.sheet;
};

const createPopup = () => {
  // ELEMENTS
  const container = document.createElement("div");
  const text = document.createTextNode("Test text for preview");
  const icon = document.createElement("img");
  const iconBox = document.createElement("div");
  const body = document.createElement("div");

  // CONTAINER
  container.style.zIndex = 1000;
  container.style.position = "absolute";
  container.style.backgroundColor = "white";
  container.style.visibility = "visible";
  container.style.width = "340px";
  container.style.height = "78px";
  container.style.padding = "12px 12px 12px 12px";
  container.style.bottom = "4px";
  container.style.borderRadius = "50px";
  container.style.left = "4px";
  container.style.border = "1px solid #e0e0e0";
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.boxShadow = "0px 0px 15px 0px rgb(0 0 0 / 10%)";
  container.id = "popup";

  // ANIMATION
  container.style.animation = `1s ease-out 0s 1 slideInFromLeft`;

  // ICON_BOX
  iconBox.style.visibility = "visible";
  iconBox.style.height = "78px";
  iconBox.style.width = "78px";
  iconBox.style.display = "flex";
  iconBox.style.alignItems = "center";
  iconBox.style.justifyContent = "center";
  iconBox.style.borderRadius = "39px";
  iconBox.style.border = "1px solid black";

  // BODY OF CARD
  body.style.visibility = "visible";
  body.style.height = "78px";
  body.style.width = "288px";

  // ICON
  icon.src = "https://img.icons8.com/wired/344/mac-os.png";
  icon.style.width = "48px";
  icon.style.height = "48px";

  iconBox.appendChild(icon);
  body.appendChild(text);
  container.appendChild(iconBox);
  container.appendChild(body);

  const reactAppRoot = document.getElementById("root");
  if (reactAppRoot) {
    reactAppRoot.appendChild(container);
  } else {
    document.body.insertBefore(container, document.body.firstChild);
  }
};

const config = { subtree: true, childList: true };
observer.observe(document, config);

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
}
