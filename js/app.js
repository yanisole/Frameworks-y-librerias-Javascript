'use strict';

//============Animación del título==========
//Decr: Cambia el color del título a blanco
function titleAnimationWhite(){
    $('.main-titulo').switchClass('main-titulo', 'main-titulo-2', 700, 'swing', function(){
        titleAnimationYellow();
    });
}

//Decr: Cambia el color del título a amarillo
function titleAnimationYellow(){
    $('.main-titulo-2').switchClass('main-titulo-2', 'main-titulo', 900, 'swing', function(){
        titleAnimationWhite();
    });
}
//==========Fin Animación del título========

//============Animaciones de movimiento de ficha==========
function moveCandyDownAnimation(p_candy){
    $(p_candy).slideDown('slow');
}
//==========Fin Animaciones de movimiento de ficha========

//============Animaciones de desaparición de dulce==========
//Descr: Inicia la animación que muestra la aliminación de un dulce.
function startRemoveCandyAnimation(p_candy){
    var w_candyObj = $(p_candy);
    removeCandyAnimationToggle(w_candyObj, 0, 4);    
}

//Descr: Cambia la visibilidad de un dulce
function removeCandyAnimationToggle(p_candyObj, p_count, p_max){
    p_candyObj.fadeToggle(100, 'linear', function(){
        if(p_count >= p_max)
            return;
        p_count++;
        removeCandyAnimationToggle(p_candyObj, p_count, p_max);
    });
}
//==========Fin Animaciones de desaparición de dulce========

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
    var w_rowArray = [];

    clearGrid();
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

//Descr: Limpia la grilla
function clearGrid(){
    $('div[class^="col-"').html('');
}

//Decr: Busca combinaciones válidas y asigna los puntos
function searchCombinations() {

}

//Descr: Inicia o reinicia el juego
function startGame(){    
    try{
        $('.btn-reinicio').html('Reiniciar');
        initGrid();

        //Test
        //startRemoveCandyAnimation('#candy-C5R1');        
        //moveCandyDownAnimation('#candy-C5R1');
    }catch(ex){
        alert(ex.message);
    }
}

$(document).ready(function(){
    titleAnimationWhite();   
    $('button.btn-reinicio').on('click', function() { startGame(); }); 
});