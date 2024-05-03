async function getData() {
    window.info = await (await fetch("https://apexarray.onrender.com/fetchData")).json()
}
getData()
async function getCartLen() {
    if (localStorage.getItem("account")) {
        window.cartLen = JSON.parse(await (await fetch("https://apexarray.onrender.com/cart", {
            method: "post",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email")
            })
        })).json()).ids.length
    } else window.cartLen = 0
    if (document.querySelector(".cartNumber")) document.querySelector(".cartNumber").innerHTML = cartLen
}
getCartLen()

window.cartLen = 0

if (!localStorage.getItem("appearence")) localStorage.setItem("appearence", "light")
let star
function patchClickEvents() {
    document.querySelectorAll(".product").forEach(p => {

        p.onclick = () => {
            let newUrl = new URL(location.href.split("?")[0])
            newUrl.pathname = "/View/index.html"

            newUrl.searchParams.append("id", p.getAttribute("ID"))
            location.href = newUrl.toString()
        }
    })
}
window.onload = () => {
    star = document.querySelector(".star").cloneNode(true)
    displayProducts()

    document.querySelector(".cartNumber").innerHTML = cartLen
    if (localStorage.getItem("account")) {
        document.querySelector(".sign").removeChild(document.querySelector(".signIn"))
        document.querySelector(".sign").removeChild(document.querySelector(".signUp"))
        document.querySelector(".signOut").classList.add("active")
    }
    if (localStorage.getItem("appearence") == "dark") {
        document.querySelector(".darkTheme").classList.add("active")
        document.querySelector(".lightTheme").classList.remove("active")
        document.body.classList.add("darkMode")
    }
    document.querySelector(".appearence").addEventListener("click", e => {
        if (localStorage.getItem("appearence") == "light") localStorage.setItem("appearence", "dark")
        else localStorage.setItem("appearence", "light")
        document.body.classList.toggle("darkMode")
        document.querySelectorAll(".theme").forEach(element => { element.classList.toggle("active") })
    })


    document.querySelector(".logo").onclick = () => location.pathname = "/"
    if (document.querySelector(".signIn")) document.querySelector(".signIn").onclick = () => location.pathname = "/signIn/index.html"
    if (document.querySelector(".signIn")) document.querySelector(".signUp").onclick = () => location.pathname = "/signUp/index.html"
    if (document.querySelector(".signOut")) document.querySelector(".signOut").onclick = () => { localStorage.removeItem("account"); localStorage.removeItem("username"); localStorage.removeItem("email"); location.reload() }
    document.querySelector(".account").onclick = () => document.querySelector(".sign").classList.add("active")
    document.querySelector(".cart").onclick = () => location.pathname = "/cart/index.html"
    document.querySelector("a").onclick = () => location.pathname = "/privacy/index.html"



    document.onclick = e => {
        let disable = true
        for (let i = 0; i < document.querySelector(".account").childNodes.length; i++) {
            if (e.target == document.querySelector(".account").childNodes[i]) {
                disable = false
                break
            }
        }
        if (disable || e.target == document.querySelector(".account")) document.querySelector(".sign").classList.remove("active")
    }

    document.onscroll = e => {
        if (scrollY >= 200) document.querySelector(".scrollTop").classList.add("active")
        else document.querySelector(".scrollTop").classList.remove("active")
    }
    document.querySelector(".scrollTop").onclick = () => scroll(0, 0)
}

async function displayProducts() {
    info.forEach(e => {
        let product = document.createElement("div")
        product.classList.add("product")
        product.classList.add("fade")
        product.setAttribute("ID", e.id)
        document.querySelector(".productsList").appendChild(product)

        let productImage = document.createElement("div")
        productImage.classList.add("productImage")
        productImage.classList.add("PrimaryImage")
        productImage.style.backgroundImage = `url(${e.imageUrl})`
        product.appendChild(productImage)

        let productImage2 = document.createElement("div")
        productImage2.classList.add("productImage")
        productImage2.classList.add("SecondaryImage")
        productImage2.style.backgroundImage = `url(${e.moreImages})`
        product.appendChild(productImage2)

        let productInfo = document.createElement("div")
        productInfo.classList.add("productInfo")
        product.appendChild(productInfo)

        let productName = document.createElement("div")
        productName.classList.add("productName")
        productName.innerHTML = e.name
        productInfo.appendChild(productName)

        let productRating = document.createElement("div")
        productRating.classList.add("productRating")
        productRating.innerHTML = e.rating
        productRating.appendChild(star.cloneNode(true))
        productInfo.appendChild(productRating)

        let productPrice = document.createElement("div")
        productPrice.classList.add("productPrice")
        productPrice.innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(e.price * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${e.price}$</h3>`
        productInfo.appendChild(productPrice)

        product.onmouseenter = () => {
            productImage.classList.add("active")
            productImage2.classList.add("active")
        }
        product.onmouseleave = () => {
            productImage.classList.remove("active")
            productImage2.classList.remove("active")
        }
        fadeInAnimation()
    })
    patchClickEvents()
}

function notification(message, positive) {
    if (positive == 0) document.querySelector(".notification").classList.add("danger")
    if (positive == 1) document.querySelector(".notification").classList.add("warning")
    document.querySelector(".notification").classList.add("active")
    document.querySelector(".notification").innerHTML = message
    setTimeout(() => document.querySelector(".notification").classList.remove("active"), 3000);
}

function fadeInAnimation() {
    let elements = document.querySelectorAll(".fade")

    elements.forEach(e => {
        let elementTop = e.getBoundingClientRect().top
        let revealPoint = 200

        // console.log(elementTop + "must be bigger than: " + revealPoint + scrollY);
        // console.log("\n".repeat(2));

        if (elementTop < innerHeight - revealPoint) e.classList.add("active")
        else e.classList.remove("active")
    })
}

window.addEventListener("scroll", fadeInAnimation)

let boughtTimer = +localStorage.getItem("bought") || 10000

function bought() {

    boughtTimer = Math.round(boughtTimer + (Math.random() * 600000))

    localStorage.setItem("bought", boughtTimer)

    let names = ["Elijah Davidson", "Luna Patel", "Maxwell Yang", "Amelia Casey", "Leo Nguyen", "Ava Garcia", "Logan Johnson", "Olivia Khan", "Mason Williams", "Sophia Rodriguez", "Ethan Smith", "Isabella Martinez", "Liam Brown", "Mia Lee", "Noah Jones", "Charlotte Davis", "Lucas Taylor", "Aria Wilson", "Oliver Anderson", "Emma Thompson", "Carter Clark", "Avery Hall", "Benjamin Hernandez", "Harper Lewis", "Elijah Martin", "Emily White", "William Walker", "Ella Robinson", "James Baker", "Madison Wright", "Alexander Allen", "Scarlett Hall", "Michael Green", "Sofia Adams", "Daniel King", "Chloe Scott", "Henry Turner", "Aubrey Carter", "Jackson Mitchell", "Grace Hill", "Sebastian Moore", "Avery Foster", "David Morales", "Aurora Perez", "Caleb Flores", "Hannah Kim", "Ryan Russell", "Zoe Torres", "Gabriel Diaz", "Ariana James", "Samuel Stewart", "Addison Rivera", "Dylan Rogers", "Evelyn Wood", "Matthew Ward", "Victoria Price", "Owen Stewart", "Natalie Cooper", "Wyatt Perry", "Lily Ramirez", "Jack Brooks", "Brooklyn Evans", "Luke Coleman", "Audrey Morgan", "Jayden Peterson", "Claire Bailey", "Christopher Reed", "Stella Gonzales", "Isaac Cox", "Leah Butler", "Lincoln Long", "Bella Kelly", "Mateo Howard", "Layla Hayes", "Julian Rivera", "Nova Coleman", "Eli Washington", "Skylar Bryant", "Aaron Ward", "Maya Murphy", "Nathan Taylor", "Eva Alexander", "Hudson Reed", "Alice Nelson", "Connor Baker", "Penelope Carter", "Jonathan Griffin", "Aaliyah Price", "Levi Phillips", "Ellie Peterson", "Christian Cook", "Madelyn Powell", "Isaiah Brooks", "Katherine Butler", "Josiah Morris", "Gabriella Sanchez", "Grayson Hill", "Alyssa Gomez", "Julian Fisher", "Gianna Cooper", "Hunter Ross", "Naomi Richardson", "Cameron Simmons", "Ruby Bell", "Eliana Stewart", "Carson Murphy", "Clara Howard", "Charles Henderson", "Sarah Kelly", "Dominic Bennett", "Allison Roberts"]
    let items = ["Smart Sensing Interactive Cat Snake.</p>&nbsp;For 9.99$", "Cat Lollipop.</p>&nbsp;For 9.99$", "All In One Led Jellyfish Lamp.</p>&nbsp;For 59.99$", "Leg Air Pressure Massager.</p>&nbsp;For 49.99$"]

    document.querySelector(".boughtText").innerHTML = `<p class="highlight">${names[Math.floor(Math.random() * names.length)]}.</p><p>&nbsp;Has Purchased&nbsp;</p><p class="highlight">${items[Math.floor(Math.random() * items.length)]}</p>`;
    document.querySelector(".bought").classList.add("active")

    setTimeout(() => document.querySelector(".bought").classList.remove("active"), 10000);
    setTimeout(bought, boughtTimer);
}

setTimeout(bought, boughtTimer);