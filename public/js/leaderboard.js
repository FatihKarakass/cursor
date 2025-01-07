// Yüksek skorları güncelle
async function updateHighScore(game, score) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = database.ref('users/' + user.uid);
    const snapshot = await userRef.child('highScores').child(game).once('value');
    const currentHighScore = snapshot.val() || 0;

    if (score > currentHighScore) {
        await userRef.child('highScores').child(game).set(score);
        await updateLeaderboard(game, score);
    }
}

// Liderlik tablosunu güncelle
async function updateLeaderboard(game, score) {
    const user = auth.currentUser;
    await database.ref('leaderboard/' + game).child(user.uid).set({
        email: user.email,
        score: score,
        timestamp: Date.now()
    });
}

// Liderlik tablosunu göster
async function showLeaderboard(game) {
    const leaderboardRef = database.ref('leaderboard/' + game);
    const snapshot = await leaderboardRef.orderByChild('score').limitToLast(10).once('value');
    
    let html = '<h3>En Yüksek Skorlar</h3><ul>';
    const scores = [];
    snapshot.forEach(childSnapshot => {
        scores.unshift(childSnapshot.val());
    });
    
    scores.forEach(score => {
        html += `<li>${score.email}: ${score.score}</li>`;
    });
    html += '</ul>';
    
    document.getElementById('leaderboard').innerHTML = html;
} 