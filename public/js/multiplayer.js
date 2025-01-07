// Oyun odası oluştur
async function createGameRoom() {
    const user = auth.currentUser;
    if (!user) return;

    const roomRef = database.ref('gameRooms').push();
    await roomRef.set({
        host: user.uid,
        players: {
            [user.uid]: {
                email: user.email,
                ready: true
            }
        },
        status: 'waiting',
        createdAt: Date.now()
    });

    return roomRef.key;
}

// Oyun odasına katıl
async function joinGameRoom(roomId) {
    const user = auth.currentUser;
    if (!user) return;

    const roomRef = database.ref('gameRooms/' + roomId);
    await roomRef.child('players').child(user.uid).set({
        email: user.email,
        ready: true
    });

    // Oyuncu sayısını kontrol et
    const snapshot = await roomRef.child('players').once('value');
    if (Object.keys(snapshot.val()).length === 2) {
        await roomRef.child('status').set('starting');
        startMultiplayerGame(roomId);
    }
}

// Çok oyunculu oyunu başlat
function startMultiplayerGame(roomId) {
    const gameRef = database.ref('gameRooms/' + roomId);
    
    // Oyuncu pozisyonlarını güncelle
    function updatePosition(y) {
        const user = auth.currentUser;
        gameRef.child('players').child(user.uid).update({
            position: y
        });
    }

    // Diğer oyuncuların pozisyonlarını dinle
    gameRef.child('players').on('value', snapshot => {
        const players = snapshot.val();
        Object.keys(players).forEach(playerId => {
            if (playerId !== auth.currentUser.uid) {
                updateOpponentPosition(players[playerId].position);
            }
        });
    });
} 