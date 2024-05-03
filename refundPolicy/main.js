window.onload = () => {
    document.querySelector(".logo").onclick = () => location.pathname = "/"
    if (document.querySelector(".signIn")) document.querySelector(".signIn").onclick = () => location.pathname = "/signIn/index.html"
    if (document.querySelector(".signIn")) document.querySelector(".signUp").onclick = () => location.pathname = "/signUp/index.html"
    if (document.querySelector(".signOut")) document.querySelector(".signOut").onclick = () => { localStorage.removeItem("account"); localStorage.removeItem("username"); localStorage.removeItem("email"); location.reload() }
    document.querySelector(".account").onclick = () => document.querySelector(".sign").classList.add("active")
    document.querySelector(".cart").onclick = () => location.pathname = "/cart/index.html"

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
}

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