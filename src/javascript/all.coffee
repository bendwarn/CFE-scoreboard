$('.sq').each ->
    sq = $ @
    sq.css 'height', sq.css('width').replace('px', '') / sq.parent().css('height').replace('px', '') * 100 + '%'
