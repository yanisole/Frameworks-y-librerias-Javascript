'use strict';

var _maxRows = 7, _maxColumns = 7, _minCombinationSize = 3, _maxDistance = 30;
//Estas variables se usan para poder realizar el loop de validación de
//combinaciones, recarga de dulces y repetir el ciclo hasta no 
//encontrarse combinaciones.
var _onFadeToggleAnimation = {};

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

//============Drag Animación==========
function addDragAnimation(p_candy){
    var w_dragOffset = 10;
    p_candy.draggable({
        drag: function(event, ui){
            onDragEvent(event, ui);
        },
        stop: function(event, ui){            
            onDragStopEvent(event, ui);
        }
    }); 
}

function onDragEvent(p_event, p_ui){
    var w_left = 0;

    try{
        //Una ficha solo puede moverse a la izquierda,
        //a la derecha o hacia abajo.
        if(p_ui.position.top < 0)
            p_ui.position.top = 0;                

        //Verifico si el movimiento es posible.
        //Solo puedo moverme de forma vertical u horizontal, pero nunca
        //en diagonal.
        w_left = Math.abs(p_ui.position.left);
        if(w_left > p_ui.position.top)
            p_ui.position.top = 0;
        else if(w_left <= p_ui.position.top)
            p_ui.position.left = 0;
            
        if(w_left >= _maxDistance || p_ui.position.top >= _maxDistance){     
            p_event.preventDefault();
        }
    }
    catch(ex){
        p_event.preventDefault();
        alert(ex.message);
    }
}

function onDragStopEvent(p_event, p_ui){
    var w_candy = null, w_swap = null;
    var w_candyCoord = null;
    try{
        w_candy = $(p_ui.helper)
        w_candyCoord = candyState(w_candy);

        //Verifico si el movimiento vertical
        if(isVerticalMove(p_ui.originalPosition, p_ui.position)){
            //Verifico si el movimiento es válido
            if(canMoveVertical(w_candy))
                swapDown(w_candy, w_candyCoord.column, w_candyCoord.row);
            else
                swapDownCancel(w_candy);
        }else {
            //Verifico si el movimiento es válido
            if(!canMoveHorizontal(w_candy))                
                return;
            //Muevo el dulce hacia la izquierda
            if(isLeftMove(p_ui.position)){
                swapLeft(w_candy, w_candyCoord.column, w_candyCoord.row);
            }
        }
    }catch(ex){
        alert(ex.message);
    }   
}   

function canMoveHorizontal(p_candy, p_column, p_row){
    var w_left = scanLeft(p_column, p_row, p_candy);
    var w_right = scanRight(p_column, p_row, p_candy);
    var w_down = 0;

    if(w_left.count + w_right.count + 1 >= _minCombinationSize)
        return true;
    
    w_down = scanDown(p_row, p_column, p_candy);
    return (w_down.count + 1 >= _minCombinationSize);
}

function canMoveLeft(p_candy, p_column, p_row){
    var w_left = scanLeft(p_column - 1, p_row, p_candy);    
    var w_down = 0;

    if(w_left.count + w_right.count + 1 >= _minCombinationSize)
        return true;
    
    w_down = scanDown(p_row, p_column, p_candy);
    return (w_down.count + 1 >= _minCombinationSize);
}

function canMoveVertical(p_candy, p_row, p_row){
    var w_down = scanDown(p_row, p_column, p_candy);
    var w_left = 0, w_right = 0;

    if(w_down.count + 1 >= _minCombinationSize)
        return true;

    w_left = scanLeft(p_column, p_row + 1, p_candy);
    w_right = scanRight(p_column, p_row + 1, p_candy);
    return (w_left.count + w_right.count + 1 >= _minCombinationSize)
}

function isVerticalMove(p_originalPosition, p_currentPosition){
    return (p_currentPosition.top > p_originalPosition.top)
}

function isLeftMove(p_currentPosition){
    return (p_currentPosition.left < 0);
}

function swap(p_fromCandy, p_toCandy, p_fromValue, p_toValue, p_horizontal){
    p_fromCandy.addClass('dulce');
    p_toCandy.addClass('dulce');

    if(!p_horizontal){
        p_fromCandy.animate({
            top: p_fromValue      
        }, 
        300,
        function(){
            p_fromCandy.removeClass('dulce');
        });

        p_toCandy.addClass('dulce');
        p_toCandy.animate({
            top: p_toValue      
        }, 
        300,
        function(){
            p_toCandy.removeClass('dulce');
        });

        return;
    }

    p_fromCandy.animate({
        left: p_fromValue      
    }, 
    300,
    function(){
        p_fromCandy.removeClass('dulce');
    });

    p_toCandy.addClass('dulce');
    p_toCandy.animate({
        letf: p_toValue      
    }, 
    300,
    function(){
        p_toCandy.removeClass('dulce');
    });
}

function swapCancel(p_candy, p_value, p_horizontal){
    p_candy.addClass('dulce');
    if(!p_horizontal){
        p_candy.animate({
            top: p_value      
        }, 
        300,
        function(){
            p_candy.removeClass('dulce');        
        });

        return;
    }

    p_candy.animate({
        left: p_value      
    }, 
    300,
    function(){
        p_candy.removeClass('dulce');        
    });    
}

function swapDown(p_candy, p_column, p_row){
    var w_nextCandy = getCandy(p_column, p_row + 1);
    swap(p_candy, w_nextCandy, '+=' + (96 - _maxDistance), '-=96', false);
}

function swapDownCancel(p_candy){
    swapCancel(p_candy, '-=' + _maxDistance, false);
}

function swapLeft(p_candy, p_column, p_row){
    var w_nextCandy = getCandy(p_column - 1, p_row);
    swap(p_candy, w_nextCandy, '-=' + (96 - _maxDistance), '+=96', true);
}

function swapLeftCancel(p_candy){
    swapCancel(p_candy, '+=' + _maxDistance, false);
}

function swapRight(p_candy, p_column, p_row){
    var w_nextCandy = getCandy(p_column + 1, p_row);
    swap(p_candy, w_nextCandy, '+=' + (96 - _maxDistance), '-=96', true);
}

function swapRightCancel(p_candy){
    swapCancel(p_candy, '-=' + _maxDistance, true);   
}
//==========Fin Drag Animación========

//============Animaciones de movimiento de ficha==========
//Descr: Lanza un dulce nuevo a la grilla
function dropCandyArray(p_array, p_columnObj){
    var w_candy = null;

    if(p_array.length == 0)
        return;
    
    w_candy = p_array.pop();
    p_columnObj.prepend(w_candy);
    
    w_candy.addClass('dulce');
    w_candy.animate({
        top: '+=96',
        height: 'toogle'       
    }, 
    300,
    function(){
        w_candy.removeClass('dulce');
        dropCandyArray(p_array, p_columnObj); 
    });
}
//==========Fin Animaciones de movimiento de ficha========

//============Animaciones de desaparición de dulce==========

function candyState(p_candy){ 
    return {
        row: Number(p_candy.attr('data-row')),
        column: Number(p_candy.attr('data-col'))        
    }
}

//Descr: Inicia la animación que muestra la aliminación de un dulce.
function startRemoveCandyAnimation(p_array){    
    var w_candy = null;
    var w_id = '';

    if(p_array.length == 0)
        return;    
    
    _onFadeToggleAnimation = {};
    while(p_array.length > 0){
        w_candy = p_array.pop();
        w_id = getCandyId(w_candy);
        _onFadeToggleAnimation[w_id] = w_candy;
       
        removeCandyAnimationToggle(w_candy, 0, 4);
    }    
}

//Descr: Cambia la visibilidad de un dulce
function removeCandyAnimationToggle(p_candyObj, p_count, p_max){
    var w_id = '', w_idPrevius = '';
    var w_candy = null;
    var w_row = 0, w_col = 0;

    p_candyObj.fadeToggle(100, 'linear', function(){
        if(p_count < p_max){           
            w_id = getCandyId(p_candyObj); 
            p_candyObj.remove();   
            delete _onFadeToggleAnimation[w_id];

            if(Object.keys(_onFadeToggleAnimation).length == 0){
               setTimeout(function(){ refillGrid(); }, 500);
            }
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
    var w_left = {}, w_right = {}, w_up = {}, w_down = {};
    var w_existCombination = false;
    var w_candy = null;
    var w_array = [];


    try{
        for(w_col = 1; w_col <= _maxColumns; w_col++){
            for(w_row = 1; w_row <= _maxRows; w_row++){
                w_value = getCandyName(w_col, w_row);

                //Busco a la izquierda
                w_left = scanLeft(w_col, w_row, w_value);
                //Busco a la derecha
                w_right = scanRight(w_col, w_row, w_value);
                w_horizontalSize = w_left.count + w_right.count + 1;

                //Busco hacia arriba
                w_up = scanUp(w_row, w_col, w_value);
                w_down = scanDown(w_row, w_col, w_value);
                w_verticalSize = w_up.count + w_down.count + 1;

                //Dulce actual
                w_combinationSize = w_verticalSize + w_horizontalSize;
                if(Math.max(w_verticalSize, w_horizontalSize) >= _minCombinationSize){                   

                    w_candy = getCandy(w_col, w_row);

                    w_array.push(w_candy);
                    $.merge(w_array, w_left.array);
                    $.merge(w_array, w_right.array);
                    $.merge(w_array, w_up.array);
                    $.merge(w_array, w_down.array);
                    
                    calculatePoints(w_combinationSize);
                }                
            }
        }

        if(w_array.length > 0)
            startRemoveCandyAnimation(w_array);
                
    }catch(ex){
        alert(ex.message);
    } 
}

//Descr: Escanea elementos iguales hacia a la izquierda del punto actual
function scanLeft(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;
    var w_array = []; 
    var w_candy = null;   
    
    if(p_startColumn == 1)
        return { count: 0, array: [] };
    
    for(w_col = p_startColumn - 1; w_col > 0; w_col--){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(w_col, p_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos iguales hacia a la derecha del punto actual
function scanRight(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;    
    var w_array = [];
    var w_candy = null;   

    if(p_startColumn == _maxColumns)
        return { count: 0, array: [] };
    
    for(w_col = p_startColumn + 1; w_col <= _maxColumns; w_col++){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(w_col, p_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos arriba hacia abajo del punto actual
function scanUp(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;
    var w_array = [];
    var w_candy = null;   

    if(w_row == 1)
        return { count: 0, array: [] };
    
    for(w_row = p_startRow - 1; w_row > 0; w_row--){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(p_column, w_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos iguales hacia abajo del punto actual
function scanDown(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;
    var w_array = [];
    var w_candy = null;   

    if(w_row == _maxRows)
        return { count: 0, array: [] };
    
    for(w_row = p_startRow + 1; w_row <= _maxRows; w_row++){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(p_column, w_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
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
        for(var w_row = _maxRows; w_row > 0; w_row--){
            w_candy = generateCandy();

            //Le asigno el id al dulce
            w_id = generateId(w_col, w_row);
            w_candy.attr({
                'id': w_id,
                'data-row': w_row,
                'data-col': w_col
            });

            
            w_colDOM = getColumn(w_col);
            w_colDOM.append(w_candy);

            addDragAnimation(w_candy);

             
        }   
    }
    scanCombinations();
}

//Descr: Genera dulces para completar la grilla
//en los espacios vacíos
function refillGrid(){
    var w_col = 0, w_row = 0, w_max = 0, w_offset = 0;
    var w_candy = null, w_colDOM = null;
    var w_candyItem = '', w_id = '';
    var w_array = [];    
    
    for(w_col = 1; w_col <= _maxColumns; w_col++){       
        //Me fijo si se eliminaron dulces de esta columna 
        w_colDOM = $('.col-' + w_col);
        w_array = w_colDOM.find('img:visible');        
        if(w_array.length == _maxRows)
            continue;

        //Actualizo el estado de los elementos que quedan
        w_array = $.makeArray(w_array).reverse();
        w_row = _maxRows;
        $.each(w_array, function(i, element){        
            w_candy = $(element);
            w_id = generateId(w_col, w_row);
            w_candy.attr({
                'id': w_id,
                'data-row': w_row,
                'data-col': w_col
            });           
            w_row--;
        });

        //Genero nuevos dulces
        w_max = _maxRows - w_array.length;
        w_offset = w_max;
        w_array = [];
        for(w_row = w_max; w_row > 0; w_row--){
            w_candy = generateCandy();

            //Le asigno el id al dulce
            w_id = generateId(w_col, w_row);
            w_candy.attr({
                'id': w_id,
                'data-row': w_row,
                'data-col': w_col
            });

            w_colDOM = getColumn(w_col);
            w_array.push(w_candy);            
            w_offset--;
        }

        w_array = w_array.reverse();
        dropCandyArray(w_array, w_colDOM);
    }

    //setTimeout(function(){ scanCombinations(); }, 1000);
    setTimeout(function(){ scanCombinations(); }, (300 * w_max));
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
    }catch(ex){
        alert(ex.message);
    }
});