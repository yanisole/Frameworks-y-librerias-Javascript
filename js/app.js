'use strict';

var _maxRows = 7, _maxColumns = 7, _minCombinationSize = 3;
//Estas variables se usan para poder realizar el loop de validación de
//combinaciones, recarga de dulces y repetir el ciclo hasta no 
//encontrarse combinaciones.
var _onFadeToggleAnimation = [], _searchCombination = false;

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
    
}
//==========Fin Animaciones de movimiento de ficha========

//============Animaciones de desaparición de dulce==========
//Descr: Inicia la animación que muestra la aliminación de un dulce.
function startRemoveCandyAnimation(p_candy){
    if(p_candy.is(':animated'))
        return;
    _onFadeToggleAnimation.push(getCandyId(p_candy));
    removeCandyAnimationToggle(p_candy, 0, 2);    
}

//Descr: Cambia la visibilidad de un dulce
function removeCandyAnimationToggle(p_candyObj, p_count, p_max){
    p_candyObj.fadeToggle(100, 'linear', function(){
        if(p_count >= p_max){
            _onFadeToggleAnimation = jQuery.grep(_onFadeToggleAnimation, function(value) { 
                return value !== getCandyId(p_candyObj); 
            });
            if(_onFadeToggleAnimation.length == 0)
                refillGrid();
            return;
        }
        p_count++;
        removeCandyAnimationToggle(p_candyObj, p_count, p_max);
    });
}
//==========Fin Animaciones de desaparición de dulce========

//============Combinaciones de dulces==========
//Descr: Busca y elimina combinaciones. Además devuleve un bool
//que dice si hubo al menos una combinación
function scanCombinations(){
    var w_col = 0, w_row = 0, w_value = 0, w_horizontalSize = 0, w_verticalSize = 0, w_combinationSize = 0;
    var w_countLeft = 0, w_countRight = 0, w_countUp = 0, w_countDown = 0;
    var w_existCombination = false;
    var w_candy = null;


    try{
        _searchCombination = false
        for(w_col = 1; w_col <= _maxColumns; w_col++){
            for(w_row = 1; w_row <= _maxRows; w_row++){
                w_value = getCandyName(w_col, w_row);

                //Busco a la izquierda
                w_countLeft = scanLeft(w_col, w_row, w_value);
                //Busco a la derecha
                w_countRight = scanRight(w_col, w_row, w_value);
                w_horizontalSize = w_countLeft + w_countRight + 1;
                if(w_horizontalSize >= _minCombinationSize)
                    removeHorizontalCombination(w_col, w_row, w_countLeft, w_countRight);

                //Busco hacia arriba
                w_countUp = scanUp(w_row, w_col, w_value);
                w_countDown = scanDown(w_row, w_col, w_value);
                w_verticalSize = w_countUp + w_countDown + 1;
                if(w_verticalSize >= _minCombinationSize)
                    removeVerticalCombination(w_col, w_row, w_countUp, w_countDown);

                //Dulce actual
                w_combinationSize = w_verticalSize + w_horizontalSize;
                if(Math.max(w_verticalSize, w_horizontalSize) >= _minCombinationSize){
                    _searchCombination = true;
                    w_candy = getCandy(w_col, w_row);
                    startRemoveCandyAnimation(w_candy);

                    calculatePoints(w_combinationSize);
                }                
            }
        }
    }catch(ex){
        alert(ex.message);
    }  
}

//Descr: Escanea elementos iguales hacia a la izquierda del punto actual
function scanLeft(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;    
    
    if(p_startColumn == 1)
        return 0;
    
    for(w_col = p_startColumn - 1; w_col > 0; w_col--){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return w_count;
        w_count++;
    }

    return w_count;
}

//Descr: Escanea elementos iguales hacia a la derecha del punto actual
function scanRight(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;    
    
    if(p_startColumn == _maxColumns)
        return 0;
    
    for(w_col = p_startColumn + 1; w_col <= _maxColumns; w_col++){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return w_count;
        w_count++;
    }

    return w_count;
}

//Descr: Escanea elementos arriba hacia abajo del punto actual
function scanUp(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;

    if(w_row == 1)
        return 0;
    
    for(w_row = p_startRow - 1; w_row > 0; w_row--){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return w_count;
        w_count++;
    }

    return w_count;
}

//Descr: Escanea elementos iguales hacia abajo del punto actual
function scanDown(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;

    if(w_row == _maxRows)
        return 0;
    
    for(w_row = p_startRow + 1; w_row <= _maxRows; w_row++){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return w_count;
        w_count++;
    }

    return w_count;
}

//Descr: Elimina combinaciones horizontales
function removeHorizontalCombination(p_startColumn, p_startRow, p_offsetLeft, p_offsetRight){
    var w_col = p_startColumn - 1, w_offset = 0;
    var w_candy = null;

    w_offset = p_offsetLeft
    while(w_offset > 0)
    {
        w_candy = getCandy(w_col, p_startRow);
        startRemoveCandyAnimation(w_candy);
        w_col--;
        w_offset--;
    }

    w_col = p_startColumn + 1;
    w_offset = p_offsetRight;
    while(w_offset > 0){
        w_candy = getCandy(w_col, p_startRow);
        startRemoveCandyAnimation(w_candy);
        w_col++;
        w_offset--;
    }
}

//Descr: Elimina combinaciones verticales
function removeVerticalCombination(p_startColumn, p_startRow, p_offsetUp, p_offsetDown){
    var w_row = p_startRow - 1, w_offset = 0;
    var w_candy = null;

    w_offset = p_offsetUp
    while(w_offset > 0)
    {
        w_candy = getCandy(p_startColumn, w_row);
        startRemoveCandyAnimation(w_candy);
        w_row--;
        w_offset--;
    }

    w_row = p_startRow + 1;
    w_offset = p_offsetDown;
    while(w_offset > 0){
        w_candy = getCandy(p_startColumn, w_row);
        startRemoveCandyAnimation(w_candy);
        w_row++;
        w_offset--;
    }
}

//Descr: Se calculan los puntos obtenidos por la combinación
//Se usa una fórmula secilla. 
function calculatePoints(p_combinationSize){
    var w_minPoints = 100;
    var w_rem = Math.ceil(p_combinationSize / _minCombinationSize);
    var w_points = w_minPoints * w_rem;
    var w_score = Number($('#score-text').html()) + w_points;

    $('#score-text').html(w_score);
}
//==========Fin Combinaciones de dulces========

//Decr: Devuelve un entero entre 0 y p_max - 1.
//p_max => Límite máximo
function rollDice(p_max){
    return (Math.floor(Math.random() * p_max));
 }

 //Genera un dulce. Valores posibles:
 //1.png, 2.png, 3.png, 4.png
function generateCandy(){    
    var w_candy = generateCandyItem();
    var w_src = 'image/' + w_candy;
    return $('<img />').attr({
        'src': w_src,
        'class': 'elemento',
        'data-candy': w_candy
    });
}

 //Genera un dulce. Valores posibles:
 //1.png, 2.png, 3.png, 4.png
function generateCandyItem(){
    var w_idx = rollDice(4) + 1;
    return String(w_idx) + '.png';
}

//Descr: Genera el Id para un dulce
//p_column => Índice de la columna.
//p_row => Índice de la fila.
function generateId(p_column, p_row){
    return 'candy-C' + String(p_column) + 'R' + String(p_row);
}

function getCandyId(p_candyObj){
    return p_candyObj.attr('id');
}

//Descr: Obtiene la columna, es decir, el elemento del DOM.
//p_column => Índice de la columna.
function getColumn(p_column){
    var w_col = 'div.col-' + String(p_column);
    return $(w_col);
}

//Descr: Devuelve el nombre del dulce
//p_imgDOM => Objeto del DOM que contiene la imágen del dulce.
function getCandyName(p_column, p_row){
    var w_candy = getCandy(p_column, p_row);
    return w_candy.attr('data-candy');
}

//Descr: Setea el dulce de una celda
function setCandy(p_candyObj, p_value){   
    var w_src = 'image/' + p_value; 
    return p_candyObj.attr({
        src: w_src,
        'data-candy': p_value 
    });
}

//Descr: Devuelve el objeto del dom con el dulce
function getCandy(p_column, p_row){
    var w_id = '#' + generateId(p_column, p_row);
    return $(w_id);
}

//Descr: Inicializa la grilla
function initGrid(){
    var w_col = 0, w_row = 0;
    var w_candy = null, w_colDOM = null;
    var w_id = '';
    var w_rowArray = [];

    clearGrid();
    for(var w_col = 1; w_col <= _maxColumns; w_col++){        
        for(var w_row = 1; w_row <= _maxRows; w_row++){
            w_candy = generateCandy();

            //Le asigno el id al dulce
            w_id = generateId(w_col, w_row);
            w_candy.attr('id', w_id);

            w_colDOM = getColumn(w_col);
            w_colDOM.append(w_candy);
        }   
    }
}

//Descr: Genera dulces para completar la grilla
//en los espacios vacíos
function refillGrid(){
    var w_col = 0, w_row = 0;
    var w_candy = null, w_colDOM = null;
    var w_candyItem = '';

    for(w_col = _maxColumns; w_col > 0; w_col--){
        for(w_row = _maxRows; w_row > 0; w_row--){
            w_candy = getCandy(w_col, w_row);
            if(w_candy.is(':visible'))
                continue;

            w_candyItem = generateCandyItem();
            setCandy(w_candy, w_candyItem);
            w_candy.show();
        }
    }

    if(_searchCombination)
        scanCombinations();
}

//Descr: Limpia la grilla
function clearGrid(){
    $('div[class^="col-"').html('');
}

//Descr: Inicia o reinicia el juego
function startGame(){    
    try{
        $('.btn-reinicio').html('Reiniciar');
        $('#score-text').html(0);
        $('#movimientos-text').html(0);
        initGrid();  
    }catch(ex){
        alert(ex.message);
    }
}

$(document).ready(function(){
    try{
        titleAnimationWhite();   
        $('button.btn-reinicio').on('click', function() { startGame(); }); 
        //Test
        $('#btn-scan').on('click', function() { scanCombinations(); });
    }catch(ex){
        alert(ex.message);
    }
});