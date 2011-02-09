var gCardListDoc;
var gCardList;
var gFunctionalityMessage = "<p>Your browser does not support the functions needed for Web Flash.<br>You should upgrade to the latest Mozilla Firefox or Internet Explorer</p>\n";
var gLoadTimer;
var gDebugWindow;

// ***********************
// Object methods
// ***********************
function GetObject(iObject)
{
  var object;
  if (iObject)
  {
    if (isString(iObject))
      object = document.getElementById(iObject);
    else
      object = iObject;
  }
  return object;
}

function isAlien(a) {
   return isObject(a) && typeof a.constructor != 'function';
}

function isArray(a) {
    return isObject(a) && a.constructor == Array;
}

function isBoolean(a) {
    return typeof a == 'boolean';
}

function isEmpty(o) {
    var i, v;
    if (isObject(o)) {
        for (i in o) {
            v = o[i];
            if (isUndefined(v) && isFunction(v)) {
                return false;
            }
        }
    }
    return true;
}

function isFunction(a) {
    return typeof a == 'function';
}

function isNull(a) {
    return a === null;
}

function isNumber(a) {
    return typeof a == 'number' && isFinite(a);
}

function isObject(a) {
    return (a && typeof a == 'object') || isFunction(a);
}

function isString(a) {
    return typeof a == 'string';
}

function isUndefined(a) {
    return typeof a == 'undefined';
} 

// ***********************
// Debug methods
// ***********************
function Debug(iDebugText)
{
  if (gDebugWindow)
    gDebugWindow.document.write(iDebugText);
}

function DebugLn(iDebugText)
{
  Debug("<p>" + iDebugText + "<p>\n");
}

function DebugObjectTable(name, object)
{
  gDebugWindow.document.writeln("<h2>" + name +"</h2>");
  gDebugWindow.document.writeln("<table border=2> <tr><th>Field<th>Type<th>Value");
  for (field in object)
  {
    //The typeof operator returns type information as a string. There are six possible values that typeof returns: "number", "string", "boolean", "object", "function", and "undefined".
    //The parentheses are optional in the typeof syntax. 
    gDebugWindow.document.writeln("<tr><td>" + field + "</td><td>" + typeof object[field] + "</td><td>" + object[field] + "</td></tr>");
  }
  gDebugWindow.document.writeln("</table>");
}

function DebugError(iError)
{
  var errorTxt = "Error\n";
  errorTxt += iError.message + "\n";
  //Debug(errorTxt);
  alert(errorTxt);
}

// ***********************
// Utilities
// ***********************
function ShowProgress(iNumberLoaded, iNumberToLoad)
{
  if (gCardList)
  {
    SetElementValue("LoadStatus", iNumberLoaded + " of " + iNumberToLoad + " cards loaded ...");
    //alert(gCardList.Card.length + " cards loaded ...");
  }
  else
  {
    //alert("No card list yet...");
  }
  //gLoadTimer = setTimeout("ShowProgress()",500);
}

/* Node types:
1  	ELEMENT_NODE
2 	ATTRIBUTE_NODE
3 	TEXT_NODE
4 	CDATA_SECTION_NODE
5 	ENTITY_REFERENCE_NODE
6 	ENTITY_NODE
7 	PROCESSING_INSTRUCTION_NODE
8 	COMMENT_NODE
9 	DOCUMENT_NODE
10 	DOCUMENT_TYPE_NODE
11 	DOCUMENT_FRAGMENT_NODE
12 	NOTATION_NODE
*/

//var DHTML = (document.getElementById || document.all || document.layers);

function TestFunctionality()
{
  var returnVal = 0;
  var dhtml = document.getElementById;
  var loadCardFileIE = window.ActiveXObject;
  var loadCardFileMozilla = (document.implementation && document.implementation.createDocument);
  var loadCardFile = (loadCardFileIE || loadCardFileMozilla);
  returnVal = (dhtml && loadCardFile)
  return (returnVal);
}

function SetElementHtml(iElement, iElemValue)
{
  var docElem = GetObject(iElement);
  if (docElem)
    docElem.innerHTML = iElemValue;
}

function GetElementHtml(iElement)
{
  var elemHtml = "";
  var docElem = GetObject(iElement);
  if (docElem)
    elemHtml = docElem.innerHTML;
  return (elemHtml);
}

function SetElementValue(iElement, iElemValue)
{
  var docElem = GetObject(iElement);
  if (docElem)
    docElem.value = iElemValue;
}

function GetElementValue(iElement)
{
  var elemVal = "";
  var docElem = GetObject(iElement);
  if (docElem)
    elemVal = docElem.value;
  return (elemVal);
}

function SetButtonClick(iButton, iClickAction)
{
  var button = GetObject(iButton);
  if (button)
  {
    if (button.addEventListener)
      button.addEventListener('click', iClickAction, false);
    else
      button.onclick = iClickAction;
  }
}

function HaveCardList()
{
  var haveCardList = 0;
  if (gCardList && 
      gCardList.Setup && 
      gCardList.Card && 
      gCardList.Card.length > 0)
    haveCardList = 1;
  return (haveCardList);
}

function RemoveChildrenFromNode(iNode)
{
  var node = GetObject(iNode);
  if (node)
  {   
	  while (node.hasChildNodes())
	  {
	    node.removeChild(node.firstChild);
	  }
	}
}

// ***********************
// CardList class
// ***********************
function CardList()
{
  this.Card = new Array();
  
  this.GetSetupData = function(iDataName, iDataNumber)
  {
    var setupData;
    
    if (this.Setup && 
        this.Setup[iDataName])
    {
      var setupData;
      if (isArray(this.Setup[iDataName]))
      { // Have array
        var dataNumber = 0;
        if (iDataNumber)
          dataNumber = iDataNumber;
        if (dataNumber >= 0 && 
            dataNumber < this.Setup[iDataName].length)
          setupData = this.Setup[iDataName][dataNumber];
      } // End if array
      else if (!iDataNumber || 
              0 == iDataNumber)
      { // Not array
        setupData = this.Setup[iDataName];
      } // End if not array
    }
      
    return (setupData);
  }

  this.SetSetupDefaultValues = function()
  {

    if (!this.Setup.Difficulty)
    {
      this.Setup.Difficulty = new Object();
      this.Setup.Difficulty.Name = "Difficulty";
    }
    if (!this.Setup.CardNumber)
    {
      this.Setup.CardNumber = new Object();
      this.Setup.CardNumber.Name = "CardNumber";
      this.Setup.CardNumber.DisplayName = "Card Number";
    }
  }

  this.GetName = function(iDataName, iDataNumber)
  {
    var name;
    
    var setupData = this.GetSetupData(iDataName, iDataNumber);
      
    if (setupData)
    {
      name = setupData.Name;
    }
    
    return (name);
  }

  this.GetDisplayName = function(iDataName, iDataNumber)
  {
    var displayName;
    
    var setupData = this.GetSetupData(iDataName, iDataNumber);
      
    if (setupData)
    {
      if (setupData.DisplayName)
        displayName = setupData.DisplayName;
      else
        displayName = setupData.Name;
    }
    
    return (displayName);
  }

  this.GetCardViewFieldId = function(iDataName, iDataNumber)
  {
    var fieldId;
    
    var setupData = this.GetSetupData(iDataName, iDataNumber);
      
    if (setupData)
    {
      if (setupData.CardViewFieldId)
        fieldId = setupData.CardViewFieldId;
      else
        fieldId = setupData.Name + "CardViewField";
    }
    
    return (fieldId);
  }

  this.AddCard = function(iCardData)
  {
    //DebugLn('AddCard (CardData): ' + iCardData[gCardList.GetName("FrontClue")]);
    if (!iCardData.Difficulty)
      iCardData.Difficulty = 0;
    if (!iCardData.Hint)
      iCardData.Hint = "";
    this.Card[this.Card.length] = iCardData;
  }

  this.GetNumCards = function()
  {
    var numCards = 0;
    if (this.Card && 
        this.Card.length)
      numCards = this.Card.length;
    return numCards;
  }

  this.GetCard = function(iCardNum)
  {
    var cardNum = iCardNum;
    if (cardNum < 0)
      cardNum = 0;
    else if (cardNum >= this.Card.length)
      cardNum = this.Card.length - 1;
    return this.Card[cardNum];
  }

  this.CompareIntegerField = function(iFieldName, iIndex0, iIndex1)
  {
    DebugLn("CompareIntegerField: " + iFieldName + ", " + iIndex0 + ", " + iIndex1);
    var compareValue = 0;

    var card0 = this.GetCard(iIndex0);
    var card1 = this.GetCard(iIndex1);
    DebugLn("CompareIntegerField: " + this.GetName(iFieldName) + ", " + card0[this.GetName(iFieldName)] + ", " + card1[this.GetName(iFieldName)]);
    if (parseInt(card0[this.GetName(iFieldName)]) < 
        parseInt(card1[this.GetName(iFieldName)]))
      compareValue = -1;
    else if (parseInt(card0[this.GetName(iFieldName)]) > 
             parseInt(card1[this.GetName(iFieldName)]))
      compareValue = 1;

    DebugLn("CompareIntegerField: compareValue = " + compareValue);
    return compareValue;
  }

} // End CardList init.

// ***********************
// End CardList class
// ***********************

// ***********************
// XMLWriter class
// ***********************
var _IndentIncrment = "  ";
function XMLWriter()
{
    this.XML=[];
    this.Nodes=[];
    this.State="";
    this.FormatXML = function(Str)
    {
        if (Str)
            return Str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return ""
    }
    this.Indent = function()
    {
      var indent = "";
      for (ii = 1; ii < this.Nodes.length; ii++)
      {
        indent += _IndentIncrment;
      }
      return indent;
    }
    this.BeginNode = function(Name)
    {
        if (!Name) return;
        if (this.State=="beg") this.XML.push(">\n");
        this.State="beg";
        this.Nodes.push(Name);
        this.XML.push(this.Indent() + "<" + Name);
    }
    this.EndNode = function()
    {
        if (this.State=="beg")
        {
            this.XML.push("/>\n");
            this.Nodes.pop();
        }
        else if (this.Nodes.length>0)
            this.XML.push(this.Indent() + "</"+this.Nodes.pop()+">\n");
        this.State="";
    }
    this.Attrib = function(Name, Value)
    {
        if (this.State!="beg" || !Name) return;
        this.XML.push(" "+Name+"=\""+this.FormatXML(Value)+"\"");
    }
    this.WriteString = function(Value)
    {
        if (this.State=="beg") this.XML.push(">");
        this.XML.push(this.FormatXML(Value));
        this.State="";
    }
    this.Node = function(Name, Value)
    {
        if (!Name) return;
        if (this.State=="beg") this.XML.push(">\n");
        this.XML.push((Value=="" || !Value)?this.Indent()+_IndentIncrment+"<"+Name+"/>\n":this.Indent()+_IndentIncrment+"<"+Name+">"+this.FormatXML(Value)+"</"+Name+">\n");
        this.State="";
    }
    this.Close = function()
    {
        while (this.Nodes.length>0)
            this.EndNode();
        this.State="closed";
    }
    this.ToString = function(){return this.XML.join("");}
    
}

// ***********************
// End XMLWriter class
// ***********************

// ***********************
// Xml Utilities
// ***********************
function DumpCardDataNodeToXml(iXmlObject, iCardDataTag, iCardDataNode, iIndent)
{
  Debug("DumpCardDataNodeToXml: iXmlObject, iCardDataTag, iCardDataNode, iIndent = " + iXmlObject + "," + iCardDataTag + "," + iCardDataNode + "," + iIndent);
  if (iXmlObject && 
      iCardDataNode)
  {
    if (isArray(iCardDataNode))
    {
      for (iiElem = 0; iiElem < iCardDataNode.length; iiElem++)
        DumpCardDataNodeToXml(iXmlObject, iCardDataTag, iCardDataNode[iiElem], iIndent);
    } // End if array
    else
    {
      var indent = "";
      for (iiSpace = 0; iiSpace < iIndent; iiSpace++)
        indent += ' ';
      if (isString(iCardDataNode))
      { // String value: dump node name and value
        iXmlObject.Node(iCardDataTag, iCardDataNode);
      }
      else if (isObject(iCardDataNode))
      {
        iXmlObject.BeginNode(iCardDataTag);
        for (subObj in iCardDataNode)
          DumpCardDataNodeToXml(iXmlObject, subObj, iCardDataNode[subObj], iIndent+2);
        iXmlObject.EndNode(iCardDataTag);
      }
    } // End else not an array
  } // End if valid input
}

/*
function DumpCardDataNodeToXml(iXmlDocument, iCardDataTag, iCardDataNode, iIndent)
{
  Debug("DumpCardDataNodeToXml: iXmlDocument, iCardDataTag, iCardDataNode, iIndent = " + iXmlDocument + "," + iCardDataTag + "," + iCardDataNode + "," + iIndent);
  if (iXmlDocument && 
      iCardDataNode)
  {
    if (isArray(iCardDataNode))
    {
      for (iiElem = 0; iiElem < iCardDataNode.length; iiElem++)
        DumpCardDataNodeToXml(iXmlDocument, iCardDataTag, iCardDataNode[iiElem], iIndent);
    } // End if array
    else
    {
      var indent = "";
      for (iiSpace = 0; iiSpace < iIndent; iiSpace++)
        indent += ' ';
      if (isString(iCardDataNode))
      { // String value: dump node name and value
        iXmlDocument.writeln(indent + '<' + iCardDataTag + '>' + iCardDataNode + '</' + iCardDataTag + '>');
      }
      else if (isObject(iCardDataNode))
      {
        iXmlDocument.writeln(indent + '<' + iCardDataTag + '>');
        for (subObj in iCardDataNode)
          DumpCardDataNodeToXml(iXmlDocument, subObj, iCardDataNode[subObj], iIndent+2);
        iXmlDocument.writeln(indent + '</' + iCardDataTag + '>');
      }
    } // End else not an array
  } // End if valid input
}
*/

function ParseXmlNode(iXmlNode)
{
  Debug("ParseXmlNode: iXmlNode.nodeName, type = " + iXmlNode.nodeName + "," + iXmlNode.nodeType);
  var nodeKids = iXmlNode.childNodes;
  DebugLn(iXmlNode.nodeName + " nodeKids.length = " + nodeKids.length);
  var nodeData;
  var textData = "";
  var haveSubNode = 0;
  var iiNk;
  for (iiNk=0; iiNk<nodeKids.length; iiNk++)
  {
    DebugLn(iXmlNode.nodeName + " " + iiNk + ": nodeKids[iiNk].nodeName, type, value = " + nodeKids[iiNk].nodeName + "," + nodeKids[iiNk].nodeType + "," + nodeKids[iiNk].nodeValue);
    if (1 == nodeKids[iiNk].nodeType)
    { // Found a node element
      if (!haveSubNode)
      {
        haveSubNode = 1;
        nodeData = new Object();
      }
      if (nodeData[nodeKids[iiNk].nodeName])
      { // Element already exists: need to use array
        if (!nodeData[nodeKids[iiNk].nodeName].length)
        { // Do not have array yet, change to array.
          var saveData = nodeData[nodeKids[iiNk].nodeName];
          nodeData[nodeKids[iiNk].nodeName] = new Array();
          nodeData[nodeKids[iiNk].nodeName][0] = saveData;
        } // End if no array yet.
        // Add new data to array
        nodeData[nodeKids[iiNk].nodeName][nodeData[nodeKids[iiNk].nodeName].length] = ParseXmlNode(nodeKids[iiNk]);
      }
      else
      {
        nodeData[nodeKids[iiNk].nodeName] = ParseXmlNode(nodeKids[iiNk]);
      }
    } // End if found a node element.
    else if (!haveSubNode && 
             3 == nodeKids[iiNk].nodeType && 
             textData.length <= 0)
    { // Found a text element.
      textData = nodeKids[iiNk].nodeValue;
    } // End if found a text element.
  } // End loop on nodeKids
  if (!haveSubNode && 
      textData.length > 0)
    nodeData = textData;
  return (nodeData);
}

// ***********************
// Initialize card list
// ***********************
function ParseCardFile()
{
  DebugLn("ParseCardFile");
  gCardList = new CardList();
  var cardListSetup = gCardListDoc.getElementsByTagName("Setup");
  if (cardListSetup.length > 0)
  {
    gCardList.Setup = ParseXmlNode(cardListSetup[0]);
    if (gCardList.Setup)
    {
      DebugLn('gCardList.GetName("FrontClue") = ' + gCardList.GetName("FrontClue"));
      
      gCardList.SetSetupDefaultValues();
      
      var cardListCards = gCardListDoc.getElementsByTagName("Card");
      ShowProgress(0, cardListCards.length);
      DebugLn("cardListCards.length = " + cardListCards.length);
      for (iiCard=0,jjCard=0; iiCard<cardListCards.length; iiCard++,jjCard++)
      {
        var cardData = ParseXmlNode(cardListCards[iiCard]);
        DebugLn('iiCard = ' + iiCard + ': ' + cardData[gCardList.GetName("FrontClue")]);
        gCardList.AddCard(cardData);
        if (100 == jjCard)
        {
          jjCard = 0;
          ShowProgress(iiCard, cardListCards.length);
        }
      }
      //clearTimeout(gLoadTimer);
      SetElementValue("LoadStatus", "Loading finished. " + gCardList.Card.length + " cards loaded.");
      //alert(GetElementValue("LoadStatus"));
    }
  }
  
  if (!gCardList.Setup)
  {
    txt="Error: card file has no setup data.\n"
    txt+="Click OK to continue.\n"
    alert(txt)
  }
}

//Load xml card file
function LoadCardFile()
{
  DebugLn("LoadCardFile");
  SetElementValue("LoadStatus", "");
  // -------------------
  // Get card list file
  // -------------------
  var cardDocName;
  // Get file from preset list.
  var list = GetObject("CardListFilesPreset");
  if ("None" != list.options[list.selectedIndex].value)
  {
    cardDocName = list.options[list.selectedIndex].value + ".xml";
  }
  if (!cardDocName)
  { // No preset file: get from browse field.
    cardDocName = GetElementValue("CardListFilesBrowse");
    //alert("browse.value = " + cardDocName);
  }
  //alert("Card list file: " + cardDocName);
  
  if (cardDocName.length > 0)
  {
    var cardDocNameFile = "file:///" + cardDocName;
    var cardDocNameUrl = "http://theology.edu/Remata/Web/" + cardDocName;
    //DebugLn("cardDocName = " + cardDocName);
    var xmlhttp = null;
    var ie56 = 0;
    if (window.XMLHttpRequest)
    { // Code for Chrome and new Mozilla, etc.
      xmlhttp = new window.XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    { // Code for IE 5 and 6
      var xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
      ie56 = 1;
    }
    if (null != xmlhttp)
    {
      var fileError;
      try
      {
        xmlhttp.open("GET",cardDocName,false);
        if (1 == ie56)
          xmlhttp.send();
        else
          xmlhttp.send(null);
        gCardListDoc = xmlhttp.responseXML.documentElement;
      }
      catch(err)
      {
        fileError = err;
      }
      if (fileError)
      {
        fileError = null;
        try
        {
          xmlhttp.open("GET",cardDocNameUrl,false);
          if (1 == ie56)
            xmlhttp.send();
          else
            xmlhttp.send(null);
          gCardListDoc = xmlhttp.responseXML.documentElement;
        }
        catch(err)
        {
          fileError = err;
        }
      }
      
      if (fileError)
      {
        var txt = "Card file " + cardDocName + " not found.\n\n";
        txt+=fileError.message + "\n\n";
        txt+="Click OK to continue.\n\n";
        alert(txt);
      }
      /*else if (200 != xmlhttp.status)
      {
        txt="Card file " + cardDocName + " problem.\n\n"
        txt+="Status: " + xmlhttp.statusText + "\n\n"
        txt+="Click OK to continue.\n\n"
        alert(txt)
      }*/
      else if (gCardListDoc)
      {
        ProcessCards();
      }
    }
    else if (document.implementation &&
             document.implementation.createDocument)
    { // Code for old Mozilla, etc.
      var fileError;
      gCardListDoc = document.implementation.createDocument("","",null);
      gCardListDoc.async = false;
      //DebugObjectTable("XmlDoc", gCardListDoc);
      try
      {
        gCardListDoc.load(cardDocName);
      }
      catch(err)
      {
        fileError = err;
      }
      if (fileError)
      {
        fileError = null;
        try
        {
          gCardListDoc.load(cardDocNameFile);
        }
        catch(err)
        {
          fileError = err;
        }
      }
      if (fileError)
      {
        var txt = "Card file " + cardDocName + " not found.\n\n";
        txt+=fileError.message + "\n\n";
        txt+="Click OK to continue.\n\n";
        alert(txt);
      }
      else
      {
        ProcessCards();
      }
    }
    else
    {
      alert('Your browser cannot handle this script');
    }
  } // End if have file name.
  else
  {
    txt="Error: no file name given for card file.\n"
    txt+="Click OK to continue.\n"
    alert(txt)
  }
}

function UpdateFileFields(iRealFileObject, iFakeFileObject)
{
  DebugLn("UpdateFileFields");
  var fileField = GetObject(iRealFileObject);
  if (fileField)
  {
    //DebugObjectTable("File Field", fileField);
    DebugLn("UpdateFileFields: file value = " + fileField.value);
    SetElementValue(iFakeFileObject, fileField.value);
  }
  ClearPresetList();
}

function ClearPresetList()
{
  var docElem = GetObject("CardListFilesPreset");
  if (docElem)
    docElem.selectedIndex = 0;
}

function ClearBrowseFile()
{
  SetElementValue("CardListFilesBrowse", "");
}
