var gCurrentCardIndex;

// ***********************
// CardIndex class
// ***********************
function CardIndex()
{
  this.CardChoosen = new Array();
  this.CardSorted = new Array();
  this.currentCardNum = -1;
  
  this.AddCard = function(iCardNumber)
  {
    //DebugLn("AddCard: " + iCardNumber);
    this.CardChoosen[this.CardChoosen.length] = iCardNumber;
  }

  this.GetNumCards = function()
  {
    var numCards = 0;
    if (this.CardChoosen && 
        this.CardChoosen.length)
      numCards = this.CardChoosen.length;
    return numCards;
  }

  this.InitSortList = function()
  {
    DebugLn("InitSortList");
    var iiCard = 0;
    for (iiCard = 0; iiCard < this.CardChoosen.length; iiCard++)
    {
      this.CardSorted[iiCard] = this.CardChoosen[iiCard];
    }
  }
  
  this.SortCards = function()
  {
    DebugLn("SortCards");
    try
    {
      // Initialize sort list.
      this.InitSortList();
      
      // Sort based on sort order type
      var list = GetObject("SortOrder");
      switch (list.options[list.selectedIndex].value)
      {
      case "InputList": // No sort: just use input list order.
      default:
        DebugLn("SortCards: InputList");
        break;
      case "Random": // Random sort
        DebugLn("SortCards: Random");
        RandomSortCardIndex(this.CardSorted);
        break;
      case "Difficulty": // Sort by difficulty, high to low
        DebugLn("SortCards: Difficulty");
        var compareMethod = function (iIndex0, iIndex1)
          {
            var compareValue = gCardList.CompareIntegerField("Difficulty", iIndex0, iIndex1);
            return -compareValue;
          }
        QuickSortCardIndex(this.CardSorted, compareMethod);
        break;
      case "AdditionalData": // Sort by frequency, high to low
        DebugLn("SortCards: Frequency");
        var compareMethod = function (iIndex0, iIndex1)
          {
            var compareValue = gCardList.CompareIntegerField("AdditionalData", iIndex0, iIndex1);
            return -compareValue;
          }
        QuickSortCardIndex(this.CardSorted, compareMethod);
        //ShellSortCardIndex(this.CardSorted, compareMethod);
        break;
      }
    }
    catch(err)
    {
      DebugError(err);
    }
  }

  this.GotoPreviousCard = function()
  {
    this.currentCardNum = this.currentCardNum - 1;
    if (this.currentCardNum < 0)
      this.currentCardNum = this.GetNumCards() - 1;
  }

  this.GotoNextCard = function()
  {
    this.currentCardNum = this.currentCardNum + 1;
    if (this.currentCardNum >= this.GetNumCards())
      this.currentCardNum = 0;
  }

  this.GetCardIndex = function(iCardNumber)
  {
    var cardNum = iCardNumber;
    if (cardNum < 0)
      cardNum = 0;
    else if (cardNum >= this.GetNumCards())
      cardNum = this.GetNumCards() - 1;
    return this.CardSorted[iCardNumber];
  }

  this.GetCard = function(iCardNumber)
  {
    return (gCardList.GetCard(this.GetCardIndex(iCardNumber)));
  }

  this.GetCurrentCard = function()
  {
    return (gCardList.GetCard(this.GetCardIndex(this.currentCardNum)));
  }

  this.ResetCurrentCard = function()
  {
    this.currentCardNum = -1;
  }

} // End CardIndex init

// ***********************
// End CardIndex class
// ***********************

//************************
// Sort methods
//************************
// Randomly sort a card index list.
function RandomSortCardIndex(iCardIndexList)
{
  DebugLn("RandomSortCardIndex");
  
  var iiCard = 0;
  var topCard = iCardIndexList.length - 1;
  for (iiCard = 0; iiCard < topCard; iiCard++)
  {
    var numRemainingCards = iCardIndexList.length - iiCard;
    var iiSwap = Math.floor(numRemainingCards * Math.random()) + iiCard;
    if (iiSwap > topCard) 
      iiSwap = topCard;
    if (iiSwap != iiCard)
    {
      var temp = iCardIndexList[iiCard];
      iCardIndexList[iiCard] = iCardIndexList[iiSwap];
      iCardIndexList[iiSwap] = temp;
    }
  }
}

// Use quick sort algorithm to sort a card index list in ascending order.
function QuickSortCardIndex(iCardIndexList, iCompareMethod, iBeginCardIndex, iEndCardIndex)
{
  var initialBeginCardIndex = 0;
  if (iBeginCardIndex)
    initialBeginCardIndex = iBeginCardIndex;
  var initialEndCardIndex = iCardIndexList.length - 1;  
  if (iEndCardIndex)
    initialEndCardIndex = iEndCardIndex;

  var beginIndex = initialBeginCardIndex;
  var endIndex = initialEndCardIndex;
  var pivotCardNum = iCardIndexList[initialBeginCardIndex];

  while (beginIndex < endIndex)
  {
    while (iCompareMethod(iCardIndexList[endIndex], pivotCardNum) >= 0 && 
           beginIndex < endIndex)
        endIndex = endIndex - 1;
    if (beginIndex != endIndex)
    {
        iCardIndexList[beginIndex] = iCardIndexList[endIndex];
        beginIndex = beginIndex + 1;
    }
    while (iCompareMethod(iCardIndexList[beginIndex], pivotCardNum) <= 0 && 
           beginIndex < endIndex)
        beginIndex = beginIndex + 1;
    if (beginIndex != endIndex)
    {
        iCardIndexList[endIndex] = iCardIndexList[beginIndex];
        endIndex = endIndex - 1;
    }
  }
  iCardIndexList[beginIndex] = pivotCardNum;
  if (initialBeginCardIndex < beginIndex)
      QuickSortCardIndex(iCardIndexList, iCompareMethod, initialBeginCardIndex, beginIndex - 1);
  if (initialEndCardIndex > beginIndex)
      QuickSortCardIndex(iCardIndexList, iCompareMethod, beginIndex + 1, initialEndCardIndex);
}

// Use shell sort algorithm to sort a card index list in ascending order.
function ShellSortCardIndex(iCardIndexList, iCompareMethod)
{
  DebugLn("ShellSortCardIndex");
  var sortIncrement = 3
  while (sortIncrement > 0)
  {
    var iiCard = 0;
    for (iiCard = sortIncrement; iiCard < iCardIndexList.length; iiCard++)
    {
      var jjCard = iiCard;
      var tempCardNum = iCardIndexList[iiCard];
      while (jjCard >= sortIncrement && 
             iCompareMethod(iCardIndexList[jjCard - sortIncrement], tempCardNum) > 0)
      {
        var delta = jjCard - sortIncrement;
        iCardIndexList[jjCard] = iCardIndexList[delta];
        jjCard = delta;
      }
      iCardIndexList[jjCard] = tempCardNum;
    }
    if (sortIncrement == 1)
    {
      sortIncrement = 0;
    }
    else
    {
      sortIncrement = Math.floor(sortIncrement / 2);
      if (sortIncrement == 0)
        sortIncrement = 1;
    }
  }
}

// Use bubble sort algorithm to sort a card index list in ascending order.
function BubbleSortCardIndex(iCardIndexList, iCompareMethod)
{
  DebugLn("BubbleSortCardIndex");
  
  var iiCard = 0;
  for (iiCard = 0; iiCard < iCardIndexList.length - 1; iiCard++)
  {
    var jjCard = 0;
    for (jjCard = iiCard + 1; jjCard < iCardIndexList.length; jjCard++)
    {
      if (iCompareMethod(iCardIndexList[jjCard], iCardIndexList[iiCard]) < 0)
      {
        var temp = iCardIndexList[iiCard];
        iCardIndexList[iiCard] = iCardIndexList[jjCard];
        iCardIndexList[jjCard] = temp;
      }
    }
  }
}

//************************
// Card load methods
//************************
function SetButtonEnable(iButtonName, iEnableState)
{
  try
  {
    //DebugLn("SetButtonEnable");
    var disabledState = !iEnableState;
    var button = GetObject(iButtonName);
    if (button)
      button.disabled = disabledState;
  }
  catch(err)
  {
    DebugError(err);
  }
}

function SetCardControlButtons()
{
  try
  {
    DebugLn("SetCardControlButtons");
    
    // Choose card button.

    var enableState = false;
    if (gCardList && 
        gCardList.GetNumCards() > 0)
      enableState = true;
    //DebugLn("Choose: enableState = " + enableState);
    SetButtonEnable("chooseCardsButton", enableState);
    
    // Card control buttons
    if (enableState)
    {
      enableState = false;
      if (gCurrentCardIndex && 
          gCurrentCardIndex.GetNumCards() > 0)
        enableState = true;
    }
    //DebugLn("Control: enableState = " + enableState);
    SetButtonEnable("sortCardsButton", enableState);
    SetButtonEnable("previousCardButton", enableState);
    SetButtonEnable("nextCardButton", enableState);
    SetButtonEnable("showHintButton", false);
    SetButtonEnable("showAllButton", false);
    SetButtonEnable("rightAnswerButton", false);
    SetButtonEnable("wrongAnswerButton", false);
    SetButtonEnable("OutputApplyFilter", enableState);
    var useFilter = GetObject("OutputApplyFilter");
    if (useFilter)
      useFilter.checked = enableState;
  }
  catch(err)
  {
    DebugError(err);
  }
}

function ProcessCards()
{
  DebugLn("ProcessCards");
  try
  {
    var prevCardList = HaveCardList();
    
    ParseCardFile();
    DebugLn("ProcessCards after ParseCardFile");
    if (HaveCardList())
    {
      BuildCardChoose();
      BuildOtherOptions();
      BuildCardView();
      if (!prevCardList)
      { // In Mozilla, calling BuildOutputControl a second time causes 
        // objects to shift on page so that the copyright is on 
        // top of the cardview cell.
        BuildOutputControl();
      }
      SetElementValue("ChooseStatus", "");
      ClearCardView();
      SetCardControlButtons();
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

//************************
// Card choose methods
//************************
function ChooseCards()
{
  DebugLn("ChooseCards");
  try
  {
    gCurrentCardIndex = new CardIndex();
    var minDiff = parseInt(GetElementValue("lowDifficultyText"));
    var maxDiff = parseInt(GetElementValue("highDifficultyText"));
    var minFreq = parseInt(GetElementValue("lowFrequencyText"));
    var maxFreq = parseInt(GetElementValue("highFrequencyText"));
    var minBBG = parseInt(GetElementValue("lowBBGText"));
    var maxBBG = parseInt(GetElementValue("highBBGText"));
    //DebugLn("minFreq = " + minFreq + ", maxFreq = " + maxFreq);
    for (iiCard in gCardList.Card)
    {
      //DebugLn(iiCard + ": gCardList.Card[iiCard].Frequency: " + gCardList.Card[iiCard].Frequency);
      if (parseInt(gCardList.Card[iiCard][gCardList.GetName("Difficulty")]) >= minDiff && 
          parseInt(gCardList.Card[iiCard][gCardList.GetName("Difficulty")]) <= maxDiff && 
          parseInt(gCardList.Card[iiCard].Frequency) >= minFreq && 
          parseInt(gCardList.Card[iiCard].Frequency) <= maxFreq && 
          parseInt(gCardList.Card[iiCard].BBG) >= minBBG && 
          parseInt(gCardList.Card[iiCard].BBG) <= maxBBG)
      {
        gCurrentCardIndex.AddCard(iiCard);
      }
    }
    
    SortIndexCards();
    
    //alert("gCurrentCardIndex.GetNumCards(): " + gCurrentCardIndex.GetNumCards());
    SetElementValue("ChooseStatus", gCurrentCardIndex.GetNumCards() + " Card selected.");
    ClearCardView();
    SetCardControlButtons();
  }
  catch(err)
  {
    DebugError(err);
  }
}

function SortIndexCards()
{
  try
  {
    gCurrentCardIndex.SortCards();
    ClearCardView();
    SetCardControlButtons();
  }
  catch(err)
  {
    DebugError(err);
  }
}

function ClearCardView()
{
  try
  {
    if (gCurrentCardIndex)
      gCurrentCardIndex.ResetCurrentCard();
    SetElementValue(gCardList.GetCardViewFieldId("FrontClue"), "");
    SetElementValue(gCardList.GetCardViewFieldId("Difficulty"), "");
    SetElementValue(gCardList.GetCardViewFieldId("AdditionalData", 0), "");
    SetElementValue(gCardList.GetCardViewFieldId("FrontData", 0), "");
    SetElementValue(gCardList.GetCardViewFieldId("BackData", 0), "");
    SetElementValue(gCardList.GetCardViewFieldId("CardNumber"), "");
  }
  catch(err)
  {
    DebugError(err);
  }
}

//************************
// Card view methods
//************************
function ShowClue()
{
  DebugLn("ShowClue");
  try
  {
    var learnNewWords = GetObject("LearnNewWords");
    if (learnNewWords && 
        learnNewWords.checked)
    {
      ShowAll();
    }
    else
    {
      var curCard = gCurrentCardIndex.GetCurrentCard();
      if (curCard)
      {
        SetElementValue(gCardList.GetCardViewFieldId("FrontClue"), curCard[gCardList.GetName("FrontClue")]);
        SetElementValue(gCardList.GetCardViewFieldId("Difficulty"), curCard[gCardList.GetName("Difficulty")]);
        DebugLn();
        SetElementValue(gCardList.GetCardViewFieldId("AdditionalData", 0), curCard[gCardList.GetName("AdditionalData")]);
        if (curCard[gCardList.GetName("FrontHint")] && 
            curCard[gCardList.GetName("FrontHint")].length > 0)
          SetButtonEnable("showHintButton", true);
        else
          SetButtonEnable("showHintButton", false);
        SetButtonEnable("showAllButton", true);
        var rightAnswerOn = GetObject("RightAnswerOn");
        if (rightAnswerOn && 
            rightAnswerOn.checked)
          SetButtonEnable("rightAnswerButton", true);
        else
          SetButtonEnable("rightAnswerButton", false);
        SetButtonEnable("wrongAnswerButton", false);
      }
      SetElementValue(gCardList.GetCardViewFieldId("FrontData", 0), "");
      SetElementValue(gCardList.GetCardViewFieldId("BackData", 0), "");
      var cardNum = parseInt(gCurrentCardIndex.currentCardNum) + 1;
      SetElementValue(gCardList.GetCardViewFieldId("CardNumber"), cardNum + " of " + gCurrentCardIndex.GetNumCards());
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

function PreviousCard()
{
  DebugLn("PreviousCard");
  try
  {
    gCurrentCardIndex.GotoPreviousCard();
    ShowClue();
  }
  catch(err)
  {
    DebugError(err);
  }
}

function NextCard()
{
  DebugLn("NextCard");
  try
  {
    gCurrentCardIndex.GotoNextCard();
    ShowClue();
  }
  catch(err)
  {
    DebugError(err);
  }
}

function ShowAll()
{
  DebugLn("ShowAll");
  try
  {
    SetButtonEnable("showHintButton", false);
    SetButtonEnable("showAllButton", false);
    var curCard = gCurrentCardIndex.GetCurrentCard();
    if (curCard)
    {
      SetElementValue(gCardList.GetCardViewFieldId("FrontClue"), curCard[gCardList.GetName("FrontClue")]);
      SetElementValue(gCardList.GetCardViewFieldId("FrontData", 0), curCard[gCardList.GetName("FrontData", 0)]);
      SetElementValue(gCardList.GetCardViewFieldId("BackData", 0), curCard[gCardList.GetName("BackData", 0)]);
      SetElementValue(gCardList.GetCardViewFieldId("Difficulty"), curCard[gCardList.GetName("Difficulty")]);
      SetElementValue(gCardList.GetCardViewFieldId("AdditionalData", 0), curCard[gCardList.GetName("AdditionalData")]);
      SetButtonEnable("rightAnswerButton", true);
      SetButtonEnable("wrongAnswerButton", true);
    }
    var cardNum = parseInt(gCurrentCardIndex.currentCardNum) + 1;
    SetElementValue(gCardList.GetCardViewFieldId("CardNumber"), cardNum + " of " + gCurrentCardIndex.GetNumCards());
  }
  catch(err)
  {
    DebugError(err);
  }
}

function ShowHint()
{
  DebugLn("ShowHint");
  try
  {
    var curCard = gCurrentCardIndex.GetCurrentCard();
    if (curCard[gCardList.GetName("FrontHint")] && 
        curCard[gCardList.GetName("FrontHint")].length > 0)
      SetElementValue(gCardList.GetCardViewFieldId("FrontHint"), curCard[gCardList.GetName("FrontHint")]);
  }
  catch(err)
  {
    DebugError(err);
  }
}

function RightAnswer()
{
  DebugLn("RightAnswer");
  try
  {
    var curCard = gCurrentCardIndex.GetCurrentCard();
    curCard[gCardList.GetName("Difficulty")] -= 1;
    NextCard();
  }
  catch(err)
  {
    DebugError(err);
  }
}

function WrongAnswer()
{
  DebugLn("WrongAnswer");
  try
  {
    var curCard = gCurrentCardIndex.GetCurrentCard();
    curCard[gCardList.GetName("Difficulty")] += 2;
    NextCard();
  }
  catch(err)
  {
    DebugError(err);
  }
}

//************************
// Output methods
//************************
function PrintCardList()
{
  DebugLn("PrintCardList");
  try
  {
    var outputWindow = window.open("CardList.html");
    if (outputWindow)
    {
      outputWindow.document.writeln('<!doctype HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">');
      outputWindow.document.writeln('<html>');
      outputWindow.document.writeln('  <head>');
      outputWindow.document.writeln('    <title>Remata Card List</title>');
      outputWindow.document.writeln('    <link rel="stylesheet" type="text/css" href="Remata.css" />');
      outputWindow.document.writeln('  </head>');
      outputWindow.document.writeln('  <body id="RemataBody">');
      //outputWindow.document.writeln('    <span id="Title"><span id="TitleProgramName">Remata</span> Card List Output.</span>');
      var title = GetObject("OutputTitle");
      if (title && 
          title.value && 
          title.value.length > 0)
        outputWindow.document.writeln('    <h1>' + title.value + '</h1>');
      outputWindow.document.writeln('    <table border="medium" cellpadding="5">');
      outputWindow.document.writeln('    <th>' + gCardList.GetDisplayName("FrontData", 0) + '</th><th>' + gCardList.GetDisplayName("BackData", 0) + '</th>');
      var useFilter = GetObject("OutputApplyFilter");
      var cardList;
      if (useFilter && useFilter.checked)
        cardList = gCurrentCardIndex;
      else
        cardList = gCardList;
      for (iiCard = 0; iiCard < cardList.GetNumCards(); iiCard++)
      {
        var curCard = cardList.GetCard(iiCard);
        outputWindow.document.writeln('    <tr><td id="PrintTableCellFront">' + curCard[gCardList.GetName("FrontData", 0)] + '</td><td id="PrintTableCellBack">' + curCard[gCardList.GetName("BackData", 0)] + '</td></tr>');
      }
      outputWindow.document.writeln('    </table>');
      outputWindow.document.writeln('  </body>');
      outputWindow.document.writeln('</html>');
      outputWindow.document.close();
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

function SaveDataFile()
{
  DebugLn("SaveDataFile");
  try
  {
    var outputWindow = window.open("CardList.xml");
    if (outputWindow)
    {
      outputWindow.document.open("text/xml");
      outputWindow.document.writeln('<?xml version="1.0" encoding="ISO-8859-1"?>');
      outputWindow.document.writeln('<?xml-stylesheet type="text/xsl" href="CardList.xsl"?>');
      var xmlObject = new XMLWriter();
      if (xmlObject)
      {
        DebugLn("Begin card list");
        xmlObject.BeginNode('CardList');
        DumpCardDataNodeToXml(xmlObject, 'Setup', gCardList.Setup, 2);
        var useFilter = GetObject("OutputApplyFilter");
        var cardList;
        if (useFilter && useFilter.checked)
          cardList = gCurrentCardIndex;
        else
          cardList = gCardList;
        for (iiCard = 0; iiCard < cardList.GetNumCards(); iiCard++)
        {
          var curCard = cardList.GetCard(iiCard);
          DumpCardDataNodeToXml(xmlObject, 'Card', curCard, 2);
        }
        xmlObject.EndNode('CardList');
        outputWindow.document.write(xmlObject.ToString());
      }
      outputWindow.document.close();
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

/*
function SaveDataFile()
{
  DebugLn("SaveDataFile");
  try
  {
    var outputWindow = window.open("CardList.xml");
    if (outputWindow)
    {
      outputWindow.document.open("text/xml");
      outputWindow.document.writeln('<?xml version="1.0" encoding="ISO-8859-1"?>');
      outputWindow.document.writeln('<?xml-stylesheet type="text/xsl" href="CardList.xsl"?>');
      outputWindow.document.writeln('<CardList>');
      DumpCardDataNodeToXml(outputWindow.document, 'Setup', gCardList.Setup, 2);
      var useFilter = GetObject("OutputApplyFilter");
      var cardList;
      if (useFilter && useFilter.checked)
        cardList = gCurrentCardIndex;
      else
        cardList = gCardList;
      for (iiCard = 0; iiCard < cardList.GetNumCards(); iiCard++)
      {
        var curCard = cardList.GetCard(iiCard);
        DumpCardDataNodeToXml(outputWindow.document, 'Card', curCard, 2);
      }
      outputWindow.document.writeln('</CardList>');
      outputWindow.document.close();
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}
*/
/*
function SaveDataFile()
{
  DebugLn("SaveDataFile");
  try
  {
    var xmlDataFile = new XMLHttpRequest();
    if (xmlDataFile)
    {
      try
      {
        xmlDataFile.open('POST', 'Test1.xml', false);
        xmlDataFile.setRequestHeader('Content-type','text/xml');
        xmlDataFile.send('<CardList>');
        //xmlDataFile.send('</CardList>');
        if (200 == xmlDataFile.status)
        {
          alert(xmlDataFile.responseText);
        }
      }
      catch(err)
      {
        DebugError(err);
        alert(xmlDataFile.responseText);
      }
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}
*/

/*
function OutputDataFile(iOutputDocument)
{
  DebugLn("OutputDataFile");
  try
  {
  }
  catch(err)
  {
    DebugError(err);
  }
}

// Save xml data file
function SaveDataFile()
{
  DebugLn("SaveDataFile");
  // -------------------
  // Get card list file
  // -------------------
  var cardDocName = "CardList.xml";
  
  if (cardDocName.length > 0)
  {
    var outputDocument;
    var cardDocNameFile = "file:///" + cardDocName;
    //DebugLn("cardDocName = " + cardDocName);
    if (window.ActiveXObject)
    { // Code for IE
      outputDocument = new ActiveXObject("Microsoft.XMLDOM");
      //DebugObjectTable("XmlDoc", outputDocument);
      outputDocument.async = false;
      outputDocument.load(cardDocName);
      if (outputDocument.parseError.errorCode != 0)
        outputDocument.load(cardDocNameFile);
      if (outputDocument.parseError.errorCode != 0)
      {
        txt="Card file " + cardDocName + " not found.\n\n"
        txt+=outputDocument.parseError.reason + "\n\n"
        txt+="Click OK to continue.\n\n"
        alert(txt)
      }
      else
        OutputDataFile(outputDocument);
    }
    else if (document.implementation &&
             document.implementation.createDocument)
    { // code for Mozilla, etc.
      var fileError;
      outputDocument = document.implementation.createDocument("","",null);
      outputDocument.async = false;
      //DebugObjectTable("XmlDoc", outputDocument);
      try
      {
        outputDocument.load(cardDocName);
        OutputDataFile(outputDocument);
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
          outputDocument.load(cardDocNameFile);
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
        OutputDataFile(outputDocument);
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
*/

//************************
// Build page methods
//************************
function BuildCardChoose()
{
  DebugLn("BuildCardChoose");
  try
  {
    var cardFilterForm = GetObject("cardFilter");
    if (cardFilterForm)
    {
      var newFormText = "";
      newFormText += '      <table><th></th><th>Low</th><th>High</th>\n';
      newFormText += '        <tr><td>Difficulty:</td>\n';
      newFormText += '          <td><input type="text" id="lowDifficultyText" value="-100" size="5" maxlength="5" name="lowDifficultyTextName" /></td>\n';
      newFormText += '          <td><input type="text" id="highDifficultyText" value="100" size="5" maxlength="5" name="highDifficultyTextName" /></td>\n';
      newFormText += '        </tr><tr>\n';
      newFormText += '          <td>Frequency:</td>\n';
      newFormText += '          <td><input type="text" id="lowFrequencyText" value="0" size="5" maxlength="5" name="lowFrequencyTextName" /></td>\n';
      newFormText += '          <td><input type="text" id="highFrequencyText" value="20000" size="5" maxlength="5" name="highFrequencyTextName" /></td>\n';
      newFormText += '        </tr><tr>\n';
      newFormText += '          <td>BBG Chapter:</td>\n';
      newFormText += '          <td><input type="text" id="lowBBGText" value="0" size="2" maxlength="2" name="lowBBGTextName" /></td>\n';
      newFormText += '          <td><input type="text" id="highBBGText" value="35" size="2" maxlength="2" name="highBBGTextName" /></td>\n';
      newFormText += '      </td></tr></table>\n';
      newFormText += '      <input type="button" onClick="ChooseCards()" value="Choose Cards" id="chooseCardsButton" name="chooseCardsButtonName">\n';
      newFormText += '        <input type="text" id="ChooseStatus" name="ChooseStatusName" size="20" readonly value="">\n';
      cardFilterForm.innerHTML = newFormText;
    }    
  }
  catch(err)
  {
    DebugError(err);
  }
}

function BuildOtherOptions()
{
  DebugLn("BuildOtherOptions");
  try
  {
    var otherOptionsForm = GetObject("otherOptions");
    if (otherOptionsForm)
    {
      var newFormText = "";
      newFormText += '      Sort Order:\n';
      //newFormText += '      <select id="SortOrder" name="SortOrderName" onchange="SortIndexCards()">\n';
      newFormText += '      <select id="SortOrder" name="SortOrderName">\n';
      newFormText += '        <option value="InputList">Alphabetical</option>\n';
      newFormText += '        <option value="Random">Random</option>\n';
      //newFormText += '        <option value="Difficulty">Word Difficulty</option>\n';
      newFormText += '        <option value="AdditionalData">Word Frequency</option>\n';
      newFormText += '      </select>\n';
      newFormText += '      <input type="button" onClick="SortIndexCards()" value="Sort Cards" id="sortCardsButton" name="sortCardsButtonName">\n';
      newFormText += '    <br />\n';
      newFormText += '      <input type="checkbox" id="LearnNewWords">Learn new words\n';
      newFormText += '    <br />\n';
      newFormText += '      <input type="checkbox" id="RightAnswerOn">Always enable "Right Answer" button\n';
      newFormText += '    <br />\n';
      newFormText += '      If wrong, increase difficulty by:\n';
      newFormText += '        <input type="text" id="wrongIncrement" value="2" size="2" maxlength="2" name="wrongIncrementName" />\n';
      newFormText += '    <br />\n';
      newFormText += '      If right, decrease difficulty by:\n';
      newFormText += '        <input type="text" id="rightDecrement" value="1" size="2" maxlength="2" name="rightDecrementName" />\n';
      otherOptionsForm.innerHTML = newFormText;
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

// Add a field to a form: assume form is in a fieldset in an object that has clientWidth.
function AddFormSingleInputField(iForm, iFieldName, iFieldNumber)
{
  DebugLn("AddFormSingleInputField: iFieldName, Number = " + iFieldName + ", " + iFieldNumber);
  try
  {
    var field;
    var form = GetObject(iForm);
    if (form)
    {
      var fieldSetContainer = form.parentNode.parentNode;
      if (fieldSetContainer)
      {
        var fieldId = gCardList.GetCardViewFieldId(iFieldName, iFieldNumber);
        
        if (fieldId && 
            fieldId.length > 0)
        {
          
          var colWidth = fieldSetContainer.clientWidth;

          var nameWidth = -5;
          if ((iFieldNumber && 
               0 < iFieldNumber) || 
              (iFieldName != "FrontClue" && 
               iFieldName != "FrontData" && 
               iFieldName != "BackData"))
          {
            var displayName = gCardList.GetDisplayName(iFieldName, iFieldNumber);
            if (displayName && 
                displayName.length > 0)
            {
              var displayNameTag = displayName + ': ';
              
              var diplayNameText = document.createTextNode(displayNameTag);
              form.appendChild(diplayNameText);
              
              // Make hidden div to compute display name width.
              var hiddenDiv =  document.createElement('div');
              hiddenDiv.style.visibility = "hidden";
              hiddenDiv.style.position = "absolute";
              fieldSetContainer.appendChild(hiddenDiv);

              // Compute width
              hiddenDiv.innerHTML = displayNameTag;
              nameWidth = hiddenDiv.clientWidth;
              
              // Delete hidden div.
              fieldSetContainer.removeChild(hiddenDiv);
            } // End if valid display name
          } // End if field that should show name
          DebugLn("nameWidth = " + nameWidth);
          
          field = document.createElement('input');
          field.id = gCardList.GetCardViewFieldId(iFieldName, iFieldNumber);
          field.className = "CardViewField";
          field.type = 'text';
          var fieldWidth = colWidth - nameWidth - 50;
          DebugLn("fieldWidth = " + fieldWidth);
          field.style.width = fieldWidth + 'px';
          DebugLn("AddFormSingleInputField 1");
          form.appendChild(field);
          DebugLn("AddFormSingleInputField 2");
        
          form.appendChild(document.createElement('br'));
          DebugLn("AddFormSingleInputField 3");
        } // End if valid field id
      } // End if valid fieldset container
    } // End if valid form.
    DebugLn("AddFormSingleInputField Return");
    return field;
  } // End try
  catch(err)
  {
    DebugError(err);
  }
}

function AddFormInputField(iForm, iFieldName, iFieldNumberStart, iFieldNumberEnd)
{
  DebugLn("AddFormInputField: " + iForm + ", " + iFieldName + ", " + iFieldNumberStart + ", " + iFieldNumberEnd);
  try
  {
    var field;
    var fieldNumberStart = 0;
    var fieldNumberEnd = 0;
    var gotoLastField = false;
    if (iFieldNumberStart)
    {
      fieldNumberStart = iFieldNumberStart;
      fieldNumberEnd = iFieldNumberStart;
      if (iFieldNumberEnd)
      {
        if ("End" == iFieldNumberEnd)
          gotoLastField = true;
        else if (isNumber(iFieldNumberEnd))
          fieldNumberEnd = iFieldNumberEnd;
      }
    }
    DebugLn("fieldNumberStart, End = " + fieldNumberStart + ", " + fieldNumberEnd);
    var lastField;
    var iiFieldNumber = fieldNumberStart;
    do
    {
      DebugLn("iiFieldNumber = " + iiFieldNumber);
      lastField = AddFormSingleInputField(iForm, iFieldName, iiFieldNumber);
      DebugLn("lastField = " + lastField);
      if (lastField) field = lastField;
      iiFieldNumber++;
    } while (lastField && 
             (gotoLastField || 
              iiFieldNumber <= fieldNumberEnd));
    DebugLn("AddFormInputField Return");
    return field;
  } // End try
  catch(err)
  {
    DebugError(err);
  }
}

function BuildCardView()
{
  DebugLn("BuildCardView");
  try
  {
    var cardControlForm = GetObject("cardControl");
    if (cardControlForm)
    {
      // Remove old children
      RemoveChildrenFromNode(cardControlForm);
      
      // Add new fields
      DebugLn("BuildCardView add fields");
      AddFormInputField(cardControlForm, "FrontClue");
      AddFormInputField(cardControlForm, "FrontData", 0);
      AddFormInputField(cardControlForm, "BackData", 0);
      AddFormInputField(cardControlForm, "FrontHint");
      AddFormInputField(cardControlForm, "BackData", 1, "End");
      AddFormInputField(cardControlForm, "AdditionalData");
      AddFormInputField(cardControlForm, "Difficulty");
      AddFormInputField(cardControlForm, "CardNumber");
      
      // Add buttons
      DebugLn("BuildCardView Previous Card Button");
      var button = document.createElement('input');
      button.id = "previousCardButton";
      button.value = "Previous Card";
      button.type = "button";
      button.readonly = "true";
      DebugLn("BuildCardView Previous Card Button Event");
      SetButtonClick(button, PreviousCard);
      cardControlForm.appendChild(button);

      DebugLn("BuildCardView Next Card Button");
      button = button.cloneNode(false);      
      button.id = "nextCardButton";
      button.value = "Next Card";
      SetButtonClick(button, NextCard);
      cardControlForm.appendChild(button);
      
      cardControlForm.appendChild(document.createElement('br'));
      
      DebugLn("BuildCardView Show Hint Button");
      button = button.cloneNode(false);      
      button.id = "showHintButton";
      button.value = "Show Hint";
      SetButtonClick(button, ShowHint);
      cardControlForm.appendChild(button);
      
      DebugLn("BuildCardView Show All Button");
      button = button.cloneNode(false);      
      button.id = "showAllButton";
      button.value = "Show All";
      SetButtonClick(button, ShowAll);
      cardControlForm.appendChild(button);
      
      cardControlForm.appendChild(document.createElement('br'));
      
      button = button.cloneNode(false);      
      button.id = "rightAnswerButton";
      button.value = "Right Answer";
      SetButtonClick(button, RightAnswer);
      cardControlForm.appendChild(button);
      
      button = button.cloneNode(false);      
      button.id = "wrongAnswerButton";
      button.value = "Wrong Answer";
      SetButtonClick(button, WrongAnswer);
      cardControlForm.appendChild(button);
      
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

function BuildOutputControl()
{
  DebugLn("BuildOutputControl");
  try
  {
    var outputControlForm = GetObject("outputControl");
    if (outputControlForm)
    {
      var newFormText = "";
      newFormText += '      <input type="button" value="Print List" onclick="PrintCardList()">\n';
      newFormText += '      <input type="button" value="Save Data File" onclick="SaveDataFile()">\n';
      newFormText += '      <br/><input type="checkbox" id="OutputApplyFilter">Apply Choose Card Filter\n';
      newFormText += '      <br/>Print Title: <input type="text" id="OutputTitle" value="" size="35"/>\n';
      outputControlForm.innerHTML = newFormText;
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

function BuildFileLoad()
{
  DebugLn("BuildFileLoad");
  try
  {
    var fileLoadForm = GetObject("CardListFiles");
    if (fileLoadForm)
    {
      var newFormText = "";
      newFormText += '      Select from list:\n';
      newFormText += '        <select id="CardListFilesPreset" name="CardListFilesPresetName" onchange="ClearBrowseFile()">\n';
      newFormText += '          <option value="None"></option>\n';
      //newFormText += '          <option value="NTWords50+Test">A Few New Testament test words</option>\n';
      newFormText += '          <option value="NTWords50+">New Testament words occurring 50 or more times</option>\n';
      newFormText += '          <option value="NTWords10+">New Testament words occurring 10 or more times</option>\n';
      newFormText += '          <option value="NTWordsAll">All New Testament words</option>\n';
      newFormText += '        </select>\n';
      newFormText += '      <br>Or find a card list file:\n';
      newFormText += '        <div class="FileInput">\n';
      newFormText += '        <input type="file" id="CardListFilesBrowse" name="CardListFilesBrowseName" size="34" onchange="UpdateFileFields(this, \'CardListFilesBrowseFake\');" onkeypress="UpdateFileFields();"></input>\n';
      newFormText += '        <div id="CardListFilesBrowseFake" class="FileInputFake">\n';
      //newFormText += '        <input type="text" size="30" readonly></input>\n';
      //newFormText += '        <input type="button" value="Browse..." onclick=";"></input>\n';
      newFormText += '        </div></div>\n';
      newFormText += '        <br/><br/><input type="button" value="Load card list" onclick="LoadCardFile()"></input>\n';
      newFormText += '        <br/><br/><input type="text" id="LoadStatus" name="LoadStatusName" size="47" readonly value="Warning: large files may take a long time to load."></input>\n';
      fileLoadForm.innerHTML = newFormText;
    }
  }
  catch(err)
  {
    DebugError(err);
  }
}

function InitializePage()
{
  DebugLn("InitializePage");
  try
  {
    var remataBody = GetObject("Content");
    DebugLn("remataBody = " + remataBody);
    if (!remataBody)
      remataBody = GetObject("RemataBody");
    DebugLn("remataBody = " + remataBody);
    if (remataBody)
    {
      var newBodyText = "";
      newBodyText += '<span id="Title"><span id="TitleProgramName">Remata</span> A browser-based flashcard program.</span>';
      
      if (TestFunctionality())
      {
        newBodyText += '<table><tr><td id="LeftColumn">';
        newBodyText += '    <fieldset><legend>Select a card list file</legend>';
        newBodyText += '      <form id="CardListFiles">';
        newBodyText += '      </form>';
        newBodyText += '    </fieldset>';
        newBodyText += '    <fieldset><legend>View Cards</legend>';
        newBodyText += '      <form id="cardControl">';
        newBodyText += '      </form>';
        newBodyText += '    </fieldset>';
        newBodyText += '  </td><td id="RightColumn">';
        newBodyText += '    <fieldset><legend>Choose cards to view</legend>';
        newBodyText += '      <form id="cardFilter">';
        newBodyText += '      </form>';
        newBodyText += '    </fieldset>';
        newBodyText += '    <fieldset><legend>Other Options</legend>';
        newBodyText += '      <form id="otherOptions">';
        newBodyText += '      </form>';
        newBodyText += '    </fieldset>';
        newBodyText += '    <fieldset><legend>Print and Save</legend>';
        newBodyText += '      <form id="outputControl">';
        newBodyText += '      </form>';
        newBodyText += '    </fieldset>';
        newBodyText += '</td></tr></table>';
      } // End if browser supports page funtionality
      else
      {
        newBodyText += gFunctionalityMessage;
      } // End else no functionality
      
      newBodyText += '<br/><p id="Copyright">Copyright &copy Eric Miller<br/>All rights reserved.</p>';
      remataBody.innerHTML = newBodyText;
      
      if (TestFunctionality())
      {
        BuildFileLoad();
        SetElementValue("LoadStatus", "");
      } // End if browser supports page funtionality
    } // End if have remata body.
  }
  catch(err)
  {
    DebugError(err);
  }
}

function RemataLoad()
{
  try
  {
    //gDebugWindow = window.open("RemataDebug.html");
    if (gDebugWindow)
    {
      Debug("<html>\n");
      Debug("<head>\n");
      Debug("  <title>Debug Window: Web Flash</title>\n");
      Debug("</head>\n");
      Debug("<body>\n");
      Debug("<h1>Debug Window: Web Flash</h1>\n");
      DebugLn("Test body line");
    }
    InitializePage();
  }
  catch(err)
  {
    DebugError(err);
  }
}
