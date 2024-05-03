if (!localStorage.getItem("account")) location.pathname = "/signIn/index.html"
else {
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
}
window.cartLen = 0

let currenciesSigns = {
    USD: "$",
    EUR: "€",
    GBP: "£"
}
let total = 0
let prodToRemove = null
let quantities = {}
window.prevCur = "USD"
productHP = 600
function setDollarPrices() {
    if (document.querySelectorAll(".price").length > 2) {
        document.querySelectorAll(".price").forEach(async e => e.innerHTML = currencyConverter("USD", e.innerHTML.slice(0, -1)) + "$")
        window.prevCur = "USD"
    } else requestAnimationFrame(setDollarPrices)
}
function setEuroPrices() {
    if (document.querySelectorAll(".price").length > 2) {
        document.querySelectorAll(".price").forEach(async e => e.innerHTML = currencyConverter("EUR", e.innerHTML.slice(0, -1)) + "â¬")
        window.prevCur = "EUR"
    } else requestAnimationFrame(setEuroPrices)
}
function setPoundPrices() {
    if (document.querySelectorAll(".price").length > 2) {
        document.querySelectorAll(".price").forEach(async e => e.innerHTML = currencyConverter("GBP", e.innerHTML.slice(0, -1)) + "Â£")
        window.prevCur = "GBP"
    } else requestAnimationFrame(setPoundPrices)
}
function closeWarning() {
    document.querySelector(".darkBg").classList.remove("active")
    document.querySelector(".warningContainer").classList.remove("active")
}
window.onload = () => {
    // let mins = 0
    let mins = localStorage.getItem("mins") || 10
    let seconds = localStorage.getItem("seconds") || 0
    window.finished = false

    if (seconds == 0 && mins == 0) {
        window.finished = true
        document.querySelector(".buyMore").style.display = "none"
        document.querySelector("header").style.position = "fixed"
        document.querySelector("header").style.top = "0"
    }

    let timer = setInterval(() => {
        if (finished) return
        if (seconds == 1 && mins <= 0) {
            seconds--
            localStorage.setItem("mins", mins)
            localStorage.setItem("seconds", seconds)
            document.querySelector(".buyMore").innerHTML = `Buy 2 And Save 10%, Buy 3 And Get Extra Gift ${mins}:0${seconds}🔥`
            clearInterval(timer)
            setTimeout(() => {
                document.querySelector(".buyMore").style.display = "none"
                document.querySelector("header").style.position = "fixed"
                document.querySelector("header").style.top = "0"
            }, 1000);
            return
        }
        seconds--
        if (seconds <= 0) {
            seconds = 59
            mins--
        }
        if (seconds < 10) {
            document.querySelector(".buyMore").innerHTML = `Buy 2 And Save 10%, Buy 3 And Get Extra Gift ${mins}:0${seconds}🔥`
            localStorage.setItem("mins", mins)
            localStorage.setItem("seconds", seconds)
            return
        }
        document.querySelector(".buyMore").innerHTML = `Buy 2 And Save 10%, Buy 3 And Get Extra Gift ${mins}:${seconds}🔥`
        localStorage.setItem("mins", mins)
        localStorage.setItem("seconds", seconds)
    }, 1000);

    document.querySelector(".cartNumber").innerHTML = cartLen

    document.onscroll = e => {
        if (scrollY >= 200) document.querySelector(".scrollTop").classList.add("active")
        else document.querySelector(".scrollTop").classList.remove("active")
    }
    document.querySelector(".scrollTop").onclick = () => scroll(0, 0)

    if (localStorage.getItem("appearence") == "dark") {
        document.querySelector(".darkTheme").classList.add("active")
        document.querySelector(".lightTheme").classList.remove("active")
        document.body.classList.add("darkMode")
    }

    if (localStorage.getItem("account")) {
        document.querySelector(".sign").removeChild(document.querySelector(".signIn"))
        document.querySelector(".sign").removeChild(document.querySelector(".signUp"))
        document.querySelector(".signOut").classList.add("active")
    }

    document.querySelector(".appearence").addEventListener("click", e => {
        if (localStorage.getItem("appearence") == "light") localStorage.setItem("appearence", "dark")
        else localStorage.setItem("appearence", "light")
        document.body.classList.toggle("darkMode")
        document.querySelectorAll(".theme").forEach(element => { element.classList.toggle("active") })
    })

    document.querySelector(".darkBg").onclick = closeWarning
    if (localStorage.getItem("currency")) {
        switch (localStorage.getItem("currency")) {
            case "usd":
                setDollarPrices()
                document.querySelector(".currencySelect").selectedIndex = 0
                break;
            case "eur":
                setEuroPrices()
                document.querySelector(".currencySelect").selectedIndex = 1
                break;
            case "gbp":
                setPoundPrices()
                document.querySelector(".currencySelect").selectedIndex = 2
                break;
        }
    }
    document.querySelector(".logo").onclick = () => location.pathname = "/"
    if (document.querySelector(".signIn")) document.querySelector(".signIn").onclick = () => location.pathname = "/signIn/index.html"
    if (document.querySelector(".signIn")) document.querySelector(".signUp").onclick = () => location.pathname = "/signUp/index.html"
    if (document.querySelector(".signOut")) document.querySelector(".signOut").onclick = () => { localStorage.removeItem("account"); localStorage.removeItem("username"); localStorage.removeItem("email"); location.reload() }
    document.querySelector(".account").onclick = () => document.querySelector(".sign").classList.add("active")
    document.querySelector(".cart").onclick = () => location.pathname = "/cart/index.html"
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

    document.querySelector(".buyBtn").onclick = () => {
        if (document.querySelector(".couponInput").value !== "") createOrder({ ids: window.ids, coupon: document.querySelector(".couponInput").value, currency: localStorage.getItem("currency"), quantities: quantities })
        else createOrder({ ids: window.ids, coupon: null, currency: localStorage.getItem("currency"), quantities: quantities })
    }
    if (document.querySelectorAll(".product").length == 0) {
        document.querySelector(".empty").classList.add("active")
        document.querySelector(".checkOut").classList.add("active")
    }

    document.querySelector(".currencySelect").addEventListener("input", ev => {
        localStorage.setItem("currency", ev.target.value.slice(0, -1).toLowerCase())
        document.querySelectorAll(".price").forEach(async el => {
            let amount = 0
            for (let i = el.innerHTML.length; i >= 0; i--) {
                if (!isNaN(el.innerHTML.slice(0, i))) {
                    amount = el.innerHTML.slice(0, i)
                    break
                }
            }
            el.innerHTML = (await currencyConverter(ev.target.value.slice(0, -1), amount)).toFixed(2) + ev.target.value.slice(-1)
            if (el == document.querySelectorAll(".price")[document.querySelectorAll(".price").length - 1]) window.prevCur = ev.target.value.slice(0, -1)
        });
    })
}

async function display() {
    window.ids = []
    const data = await (await fetch("https://apexarray.onrender.com/fetchData")).json();

    let request = JSON.parse(await (await fetch("https://apexarray.onrender.com/cart", {
        method: "post",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            email: localStorage.getItem("email")
        })
    })).json()).ids

    if (request.length == 0) {
        document.querySelector(".container").classList.add("active")
        document.querySelector(".empty").classList.add("active")
        document.querySelector(".checkOut").classList.add("active")
        return
    }

    request.sort()

    request = removeDuplicates(request)

    request.forEach(i => {
        quantities[i] = 1
    })


    document.querySelector(".empty").classList.remove("active")
    document.querySelector(".checkOut").classList.remove("active")


    request.forEach(e => {
        let currentProduct = data.find(p => {
            return p.id == +e
        })

        window.ids.push(currentProduct.id)
        let product = document.createElement("div")
        product.classList.add("product")
        product.classList.add("fade")
        product.setAttribute("ID", currentProduct.id)
        document.querySelector(".products").appendChild(product)

        fadeInAnimation()

        let productImage = document.createElement("div")
        productImage.classList.add("productImage")
        productImage.style.backgroundImage = `url(${currentProduct.imageUrl})`
        product.appendChild(productImage)

        let productInfo = document.createElement("div")
        productInfo.classList.add("productInfo")
        product.appendChild(productInfo)

        let productName = document.createElement("div")
        productName.classList.add("productName")
        productName.innerHTML = currentProduct.name
        productInfo.appendChild(productName)

        let quantity = document.createElement("div")
        quantity.classList.add("quantity")
        productInfo.appendChild(quantity)

        let productPrice = document.createElement("div")
        productPrice.classList.add("productPrice")
        productPrice.classList.add("price")
        productPrice.innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(currentProduct.price * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${currentProduct.price}$</h3>`
        productInfo.appendChild(productPrice)


        let increase = document.createElement("div")
        increase.classList.add("increase")
        increase.classList.add("active")
        increase.innerHTML = "+"
        quantity.appendChild(increase)

        let quantityValue = document.createElement("input")
        quantityValue.type = "number"
        quantityValue.min = 1
        quantityValue.maxLength = 2
        quantityValue.classList.add("quantityValue")
        quantityValue.value = "1"
        quantity.appendChild(quantityValue)

        let decrease = document.createElement("div")
        decrease.classList.add("decrease")
        decrease.innerHTML = "-"
        quantity.appendChild(decrease)

        increase.onclick = () => {
            quantityValue.value++

            if (quantityValue.value <= 25) {
                window.prevCur = "USD"
                document.querySelector(".productsTotal>h3").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) + +currentProduct.price).toFixed(2) + "$"
                document.querySelector(".productsTotal>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
                document.querySelector(".subtotalPrice>h3").innerHTML = document.querySelector(".productsTotal>h3").innerHTML
                document.querySelector(".subtotalPrice>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
            }

            if (quantityValue.value > 25) quantityValue.value = 25

            if (quantityValue.value >= 25) increase.classList.remove("active")

            if (!decrease.classList.contains("active")) decrease.classList.add("active")

            quantities[currentProduct.id] = Math.round(quantityValue.value)
        }
        decrease.onclick = () => {
            if (quantityValue.value > 1) {
                quantityValue.value--

                window.prevCur = "USD"
                document.querySelector(".productsTotal>h3").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) - +currentProduct.price).toFixed(2) + "$"
                document.querySelector(".subtotalPrice>h3").innerHTML = document.querySelector(".productsTotal>h3").innerHTML
                document.querySelector(".productsTotal>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
                document.querySelector(".subtotalPrice>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
                window.prevCur = localStorage.getItem("currency").toUpperCase()

                if (quantityValue.value < 25 && !increase.classList.contains("active")) increase.classList.add("active")
            }
            else decrease.classList.remove("active")
            quantities[currentProduct.id] = Math.round(quantityValue.value)
        }

        let prevQty = quantityValue.value
        quantityValue.addEventListener("input", () => {
            if (quantityValue.value <= 1) {
                quantityValue.value = 1
                decrease.classList.remove("active")
            }
            if (quantityValue.value > 1) decrease.classList.add("active")

            if (quantityValue.value >= 25) {
                quantityValue.value = 25
                increase.classList.remove("active")
            }
            if (quantityValue.value < 25) increase.classList.add("active")

            let difference = quantityValue.value - prevQty
            prevQty = quantityValue.value

            window.prevCur = "USD"
            document.querySelector(".productsTotal>h3").innerHTML = (+((+currentProduct.price) * difference).toFixed(2) + +document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1)).toFixed(2) + "$"
            document.querySelector(".productsTotal>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
            document.querySelector(".subtotalPrice>h3").innerHTML = document.querySelector(".productsTotal>h3").innerHTML
            document.querySelector(".subtotalPrice>p").innerHTML = (+document.querySelector(".productsTotal>h3").innerHTML.slice(0, -1) * 1.5).toFixed(2) + "$"
            window.prevCur = localStorage.getItem("currency").toUpperCase()

            quantities[currentProduct.id] = Math.round(quantityValue.value)
        })

        let removeProduct = document.createElement("div")
        removeProduct.classList.add("removeProduct")
        removeProduct.innerHTML = "Remove"
        productInfo.appendChild(removeProduct)

        removeProduct.onclick = () => {
            document.querySelector(".warningContainer").classList.add("active")
            document.querySelector(".darkBg").classList.add("active")
            prodToRemove = removeProduct.parentElement.parentElement
            console.log(removeProduct.parentElement.parentElement);
            console.log(removeProduct.parentElement.parentElement.getAttribute("ID"));
            window.productID = removeProduct.parentElement.parentElement.getAttribute("ID")
        }

        document.querySelector(".warningNo").onclick = closeWarning
        document.querySelector(".warningYes").onclick = () => {
            document.querySelector(".products").removeChild(prodToRemove)
            fetch("https://apexarray.onrender.com/cartRemove", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify({ email: localStorage.getItem("email"), id: window.productID })
            })
            if (document.querySelectorAll(".product").length == 0) {
                document.querySelector(".empty").classList.add("active")
                document.querySelector(".checkOut").classList.add("active")
            }
            fadeInAnimation()
            closeWarning()
        }

        total += +currentProduct.price
        document.querySelector(".productsTotal").innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(total.toFixed(2) * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${total.toFixed(2)}$</h3>`
        document.querySelector(".subtotalPrice").innerHTML = document.querySelector(".productsTotal").innerHTML
    });
}
display()

//stripe

function createOrder(order) {
    fetch("https://apexarray.onrender.com/createOrder", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    }).then(res => {
        if (res.ok) return res.json()
        console.log("failled to create order:");
        console.log(res);
        return
    }).then(({ url }) => window.location = url)
}

function currencyConverter(currency, amount) {
    let currencies = {
        EUR: 0.91,
        GBP: 0.79,
        USD: 1
    }
    const convertedAmount = amount * currencies[currency.toUpperCase()] / currencies[window.prevCur]
    return +(convertedAmount.toFixed(2))
}
function removeDuplicates(array) {
    return array.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}

function fadeInAnimation() {
    let elements = document.querySelectorAll(".fade")

    elements.forEach(e => {
        let elementTop = e.getBoundingClientRect().top
        let revealPoint = 200
        if (elementTop < innerHeight - revealPoint) e.classList.add("active")
        else e.classList.remove("active")
    })
}

window.addEventListener("scroll", fadeInAnimation)
window.addEventListener("scroll", () => {
    if (window.finished) return
    if (scrollY >= 50) {
        document.querySelector("header").style.position = "fixed"
        document.querySelector("header").style.top = "0"
    }
    else {
        document.querySelector("header").style.position = "absolute"
        document.querySelector("header").style.top = "50px"
    }
})


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