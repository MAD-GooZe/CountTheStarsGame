var Random = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomColor: function(min, max){
        return new Color(
            Random.getRandomInt(min, max),
            Random.getRandomInt(min, max),
            Random.getRandomInt(min, max)
        )
    }
}