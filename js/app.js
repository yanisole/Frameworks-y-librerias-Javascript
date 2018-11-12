'use strict';

var _grid

//Decr: Devuelve un entero entre 0 y p_max - 1.
//p_max => Límite máximo
function rollDice(p_max){
    return (Math.floor(Math.random() * p_max));
 }

 //Genera un dulce. Valores posibles:
 //1.png, 2.png, 3.png, 4.png
function generateCandy(){    
    var w_idx = rollDice(4) + 1;
    var w_candy = String(w_idx) + '.png';
    var w_src = 'image/' + w_candy;
    return $('<img />').attr({
        'src': w_src,
        'class': 'elemento',
        'data-candy': w_candy
    });
}

//Descr: Genera el Id para un dulce
//p_column => Índice de la columna.
//p_row => Índice de la fila.
function generateId(p_column, p_row){
    return 'candy-C' + String(p_column) + 'R' + String(p_row);
}

//Descr: Obtiene la columna, es decir, el elemento del DOM.
//p_column => Índice de la columna.
function getColumn(p_column){
    var w_col = 'div.col-' + String(p_column);
    return $(w_col);
}

//Descr: Devuelve el nombre del dulce
//p_imgDOM => Objeto del DOM que contiene la imágen del dulce.
function getCandyName(p_imgDOM){
    return $(p_imgDOM).attr('data-candy');
}

//Descr: Inicializa la grilla
function initGrid(){
    var w_maxCol = 7, w_maxRow = 7, w_col = 0, w_row = 0;
    var w_candy = null, w_colDOM = null;
    var w_id = '';

    for(var w_col = 1; w_col <= w_maxCol; w_col++){        
        for(var w_row = 1; w_row <= w_maxRow; w_row++){
            w_candy = generateCandy();

            //Le asigno el id al dulce
            w_id = generateId(w_col, w_row);
            w_candy.attr('id', w_id);

            w_colDOM = getColumn(w_col);
            w_colDOM.append(w_candy);
        }        
    }
}

//Busca combinaciones válidas y asigna los puntos
function searchCombinations() {

}

//Descr: Inicia o reinicia el juego
function startGame(){
    $('.btn-reinicio').html('Reiniciar');
    initGrid();
}

$(document).ready(function(){
    $('.btn-reinicio').bind('click', startGame());
});