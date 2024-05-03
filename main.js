window.cartLen = 0

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
fetch("https://apexarray.onrender.com/visit")

if (!localStorage.getItem("appearence")) localStorage.setItem("appearence", "light")

if (localStorage.getItem("ID")) localStorage.removeItem("ID")
window.prevCur = "USD"
if (!localStorage.getItem("currency")) localStorage.setItem("currency", "USD")
function setDollarPrices() {
    if (document.querySelectorAll(".Price").length > 2) {
        document.querySelectorAll(".Price").forEach(async e => {
            e.innerHTML = currencyConverter("USD", e.innerHTML.slice(0, -1)) + "$"
        })
        window.prevCur = "USD"
    } else requestAnimationFrame(setDollarPrices)
}
function setEuroPrices() {
    if (document.querySelectorAll(".Price").length > 2) {
        document.querySelectorAll(".Price").forEach(async e => {
            e.innerHTML = currencyConverter("EUR", e.innerHTML.slice(0, -1)) + "â¬"
        })
        window.prevCur = "EUR"
    } else requestAnimationFrame(setEuroPrices)
}
function setPoundPrices() {
    if (document.querySelectorAll(".Price").length > 2) {
        document.querySelectorAll(".Price").forEach(async e => {
            e.innerHTML = currencyConverter("GBP", e.innerHTML.slice(0, -1)) + "Â£"
        })
        window.prevCur = "GBP"
    } else requestAnimationFrame(setPoundPrices)
}
window.onload = () => {
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
    // if (localStorage.getItem("currency")) {
    //     switch (localStorage.getItem("currency")) {
    //         case "usd":
    //             setDollarPrices()
    //             document.querySelector(".currencySelect").selectedIndex = 0
    //             break;
    //         case "eur":

    //             setEuroPrices()
    //             document.querySelector(".currencySelect").selectedIndex = 1
    //             break;
    //         case "gbp":
    //             setPoundPrices()
    //             document.querySelector(".currencySelect").selectedIndex = 2
    //             break;
    //     }
    // }
    // document.querySelector(".currencySelect").addEventListener("input", ev => {
    //     localStorage.setItem("currency", ev.target.value.slice(0, -1).toLowerCase())
    //     document.querySelectorAll(".Price").forEach(async el => {
    //         let amount = 0
    //         for (let i = el.innerHTML.length; i >= 0; i--) {
    //             if (!isNaN(el.innerHTML.slice(0, i))) {
    //                 amount = el.innerHTML.slice(0, i)
    //                 break
    //             }
    //         }
    //         el.innerHTML = (await currencyConverter(ev.target.value.slice(0, -1), amount)).toFixed(2) + ev.target.value.slice(-1)
    //         if (el == document.querySelectorAll(".Price")[document.querySelectorAll(".Price").length - 1]) window.prevCur = ev.target.value.slice(0, -1)
    //     });
    // })


    document.querySelector(".logo").onclick = () => location.pathname = "/"
    if (document.querySelector(".signIn")) document.querySelector(".signIn").onclick = () => location.pathname = "/signIn/index.html"
    if (document.querySelector(".signIn")) document.querySelector(".signUp").onclick = () => location.pathname = "/signUp/index.html"
    if (document.querySelector(".signOut")) document.querySelector(".signOut").onclick = () => { localStorage.removeItem("account"); localStorage.removeItem("username"); localStorage.removeItem("email"); location.reload() }
    document.querySelector(".account").onclick = () => document.querySelector(".sign").classList.add("active")
    document.querySelector(".cart").onclick = () => location.pathname = "/cart/index.html"
    document.querySelector("a").onclick = () => location.pathname = "/privacy/index.html"
    document.querySelector(".shopAll").onclick = () => location.pathname = "/shop/index.html"
    // document.querySelector(".buyNow").onclick = () => {
    //     if (!localStorage.getItem("ID")) localStorage.setItem("ID", 1)
    //     location.pathname = "/buy/index.html"
    // }


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

    // document.querySelector(".currencySelect").addEventListener("input", ev => {
    //     document.querySelectorAll(".Price").forEach(async el => {
    //         let amount = 0
    //         for (let i = el.innerHTML.length; i >= 0; i--) {
    //             if (!isNaN(el.innerHTML.slice(0, i))) {
    //                 amount = el.innerHTML.slice(0, i)
    //                 break
    //             }
    //         }
    //         el.innerHTML = (await currencyConverter(ev.target.value.slice(0, -1), amount)).toFixed(2) + ev.target.value.slice(-1)
    //         if (el == document.querySelectorAll(".Price")[document.querySelectorAll(".Price").length - 1]) window.prevCur = ev.target.value.slice(0, -1)
    //     });
    // })
    document.onscroll = e => {
        if (scrollY >= 200) document.querySelector(".scrollTop").classList.add("active")
        else document.querySelector(".scrollTop").classList.remove("active")
    }
    document.querySelector(".scrollTop").onclick = () => scroll(0, 0)

    document.querySelectorAll(".niche").forEach(niche => {
        niche.onclick = () => {
            let newUrl = new URL(location.href.split("?")[0])
            newUrl.pathname = "/niche/"

            newUrl.searchParams.append("niche", niche.children[1].innerText)
            location.href = newUrl.toString()

        }
    })
}

function patchClickEvents() {
    document.querySelectorAll(".product").forEach(p => {
        p.classList.add("fade")
        p.onclick = () => {
            let newUrl = new URL(location.href.split("?")[0])
            newUrl.pathname = "/View/"

            newUrl.searchParams.append("id", p.getAttribute("ID"))
            location.href = newUrl.toString()
        }
    })
}

async function displayBestSellers() {
    const request = await ((await fetch("https://apexarray.onrender.com/BestSellers")).json())

    request.forEach(product => {

        let bestProduct = document.createElement("div")
        bestProduct.setAttribute("ID", product.id)
        bestProduct.classList.add("bestProduct")
        bestProduct.classList.add("product")
        document.querySelector(".bestList").appendChild(bestProduct)

        let bestProductImage = document.createElement("div")
        bestProductImage.classList.add("bestProductImage")
        bestProductImage.classList.add("bestProductImage1")
        bestProductImage.style.backgroundImage = `url(${product.imageUrl})`
        bestProduct.appendChild(bestProductImage)

        let bestProductImage2 = document.createElement("div")
        bestProductImage2.classList.add("bestProductImage")
        bestProductImage2.classList.add("bestProductImage2")
        bestProductImage2.style.backgroundImage = `url(${product.moreImages})`
        bestProduct.appendChild(bestProductImage2)

        let bestProductInfo = document.createElement("div")
        bestProductInfo.classList.add("bestProductInfo")
        bestProduct.appendChild(bestProductInfo)

        let bestProductName = document.createElement("h3")
        bestProductName.classList.add("bestProductName")
        bestProductName.innerHTML = product.name
        bestProductInfo.appendChild(bestProductName)

        let bestRating = document.createElement("h3")
        bestRating.classList.add("bestRating")
        bestRating.innerHTML = product.rating
        let starClone = document.querySelector(".star").cloneNode(true)
        starClone.classList.add("active")
        bestRating.appendChild(starClone)
        bestProductInfo.appendChild(bestRating)

        let bestProductPrice = document.createElement("h3")
        bestProductPrice.classList.add("bestProductPrice")
        bestProductPrice.innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(product.price * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${product.price}$</h3>`
        bestProductInfo.appendChild(bestProductPrice)


        bestProduct.onmouseenter = e => {
            bestProductImage.classList.add("active")
            bestProductImage2.classList.add("active")
        }
        bestProduct.onmouseleave = e => {
            bestProductImage.classList.remove("active")
            bestProductImage2.classList.remove("active")
        }
    })
    patchClickEvents()
}

displayBestSellers()

async function displayNew() {
    const request = await (await fetch("https://apexarray.onrender.com/New")).json()

    request.forEach(product => {
        let newProduct = document.createElement("div")
        newProduct.classList.add("newProduct")
        newProduct.classList.add("product")
        newProduct.setAttribute("ID", product.id)
        document.querySelector(".newList").appendChild(newProduct)

        let newProductImage = document.createElement("div")
        newProductImage.classList.add("newProductImage")
        newProductImage.classList.add("newProductImage1")
        newProductImage.style.backgroundImage = `url(${product.imageUrl})`
        newProduct.appendChild(newProductImage)

        let newProductImage2 = document.createElement("div")
        newProductImage2.classList.add("newProductImage")
        newProductImage2.classList.add("newProductImage2")
        newProductImage2.style.backgroundImage = `url(${product.moreImages})`
        newProduct.appendChild(newProductImage2)

        let newProductInfo = document.createElement("div")
        newProductInfo.classList.add("newProductInfo")
        newProduct.appendChild(newProductInfo)

        let newProductName = document.createElement("h3")
        newProductName.classList.add("newProductName")
        newProductName.innerHTML = product.name
        newProductInfo.appendChild(newProductName)

        let newProductRating = document.createElement("h3")
        newProductRating.classList.add("newProductRating")
        newProductRating.innerHTML = product.rating
        let starClone = document.querySelector(".star").cloneNode(true)
        starClone.classList.add("active")
        newProductRating.appendChild(starClone)
        newProductInfo.appendChild(newProductRating)

        let newProductPrice = document.createElement("h3")
        newProductPrice.classList.add("newProductPrice")
        newProductPrice.innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(product.price * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${product.price}$</h3>`
        newProductInfo.appendChild(newProductPrice)


        newProduct.onmouseenter = e => {
            newProductImage.classList.add("active")
            newProductImage2.classList.add("active")
        }
        newProduct.onmouseleave = e => {
            newProductImage.classList.remove("active")
            newProductImage2.classList.remove("active")
        }
    })
    patchClickEvents()
}
displayNew()

async function addProductToCart(id) {
    if (localStorage.getItem("account")) {
        let response = JSON.parse(await (await fetch("https://apexarray.onrender.com/addToCart", {
            body: JSON.stringify({ id: id, email: localStorage.getItem("email") }),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        })).json())
        notification(response.message, response.notificationState)
    } else {
        try {
            if (localStorage.getItem("cart")) {
                let cart = localStorage.getItem("cart").split(",")
                let itemID = id.toString()

                cart.push(itemID)
                localStorage.setItem("cart", cart)
            }
            else localStorage.setItem("cart", [id])
            notification("Added item to cart successfully", 2)
        } catch (err) {
            notification("Failled to add item to cart", 0)
            console.error(err)
        }
    }
}


function notification(message, positive) {
    if (positive == 0) document.querySelector(".notification").classList.add("danger")
    if (positive == 1) document.querySelector(".notification").classList.add("warning")
    document.querySelector(".notification").classList.add("active")
    document.querySelector(".notification").innerHTML = message
    setTimeout(() => document.querySelector(".notification").classList.remove("active"), 3000);
}

function currencyConverter(currency, amount) {
    let currencies = {
        EUR: 0.91,
        GBP: 0.79,
        USD: 1
    }
    const convertedAmount = amount * currencies[currency] / currencies[prevCur]
    return +(convertedAmount.toFixed(2))
}



function fadeInAnimation() {
    let elements = document.querySelectorAll(".fade")

    elements.forEach(e => {
        let elementTop = e.getBoundingClientRect().top
        let revealPoint = 100
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