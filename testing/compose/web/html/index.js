const ResClient = resclient.default;
let client = new ResClient('ws://localhost:8080');
let root = document.getElementById("root");
let player1 = document.getElementById("player1");

client.get('decs.systems').then(systems => {
    systems.toArray().forEach(element => {
        var sys = document.createElement("div");
        sys.innerText = element.name + ' (' + element.components + ') @ ' + element.framerate + "fps";
        root.appendChild(sys);
        console.log(element);
    });
}).catch(err => {
    console.log(err);
    document.body.textContent = "Error getting model. Are NATS Server and Resgate running?";
});

client.get('decs.shards').then(shards => {
    setupPlayer1();

    shards.toArray().forEach(element => {
        var shard = document.createElement("div");
        shard.innerText = element.name + ' (' + element.current + '/' + element.capacity + ');'
        shardroot.appendChild(shard);
        console.log(element);
    });
}).catch(err => {
    console.log(err);
    document.body.textContent = "Error getting model. Are NATS Server and Resgate running?";
});

let setupPlayer1 = () => {
    let position = { "x": 1.0, "y": 2.0, "z": 3.0 };
    let velocity = { "mag": 7200, "ux": 1.0, "uy": 1.0, "uz": 1.0 };
    client.call('decs.components.the_void.player1.velocity', 'set', velocity).then(res => {
        document.getElementById("magnitude").value = velocity.mag;
        document.getElementById("ux").value = velocity.ux;
        document.getElementById("uy").value = velocity.uy;
        document.getElementById("uz").value = velocity.uz;
        client.on('change', change => {
            document.getElementById("magnitude").value = change.mag;
            document.getElementById("ux").value = change.ux;
            document.getElementById("uy").value = change.uy;
            document.getElementById("uz").value = change.uz;
        })
    });
    var pos = document.createElement("div")
    pos.id = "position"
    player1.appendChild(pos)
    client.call('decs.components.the_void.player1.position', 'set', position).then(res => {
        client.get('decs.components.the_void.player1.position').then(position => {
            position.on('change', change => {
                pos.innerText = `x: ${change.x.toFixed(3)}\n y: ${change.y.toFixed(3)}\n z: ${change.z.toFixed(3)}`
            });
        });
    });
}

let changeVelocity = (event) => {
    let mag = Number.parseFloat(document.getElementById("magnitude").value);
    let ux = Number.parseFloat(document.getElementById("ux").value);
    let uy = Number.parseFloat(document.getElementById("uy").value);
    let uz = Number.parseFloat(document.getElementById("uz").value);
    let velocity = { mag, ux, uy, uz };
    client.call('decs.components.the_void.player1.velocity', 'set', velocity);
}