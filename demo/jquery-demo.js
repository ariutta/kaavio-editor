<!DOCTYPE html>
<html style="margin: 0; width: 100%; height: 100%; ">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">

    <title>Pathvisiojs Simple Built Production Example</title>

    <style type="text/css">
      html, body{width: 100%;height: 100%;margin: 0;}
    </style>
  </head>
  <body>
    <div id="pathvisiojs-container" style="width: 800px; height: 570px; border: 1px solid #ccc;">
    text<b>test2</b>test3</div>
    <div id="pathvisiojs-container2" style="width: 700px; height: 200px; border: 1px solid #ccc;">2text<b>2test2</b>2test3</div>


  <script src="./lib/pathvisiojs/pathvisiojs-2.1.3.bundle.min.js"></script>
  <script>
  /* *******************
  /* Load pathvisiojs
  /* *******************/
  $(function(){
    $('#pathvisiojs-container').pathvisiojs({
      fitToContainer: true
    , manualRender: true
    , sourceData: [
        // at least one item required
        {
          // uri:'data/wp1.xml',
          // uri:'data/WP525_74871.gpml',
          uri:'data/WP525_73040.gpml',
          // uri:'http://pointer.ucsf.edu/d3/r/data-sources/gpml.php?id=WP1',
          fileType:'gpml' // generally will correspond to filename extension
        }
      , {
          uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType:'biopax'
        }
      , {
          uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType:'png'
        }
      ]
    })

    // Get first element from array of instances
    var pathInstance = $('#pathvisiojs-container').pathvisiojs('get').pop()
    window.pathInstance = pathInstance

    // Load notification plugin
    pathvisiojsNotifications(pathInstance, {displayErrors: true, displayWarnings: true})

    // Call after render
    pathInstance.on('rendered', function(){
      // Initialize Highlighter plugin
      var hi = pathvisiojsHighlighter(pathInstance)
      window.hi = hi

      // Highlight by ID
      hi.highlight('#eb5')
      hi.highlight('id:d25e1')

      // Highlight by Text
      hi.highlight('Mitochondrion', null, {backgroundColor: 'gray'})

      // Highlight by xref
      hi.highlight('xref:id:http://identifiers.org/wormbase/ZK1193.5', null, {backgroundColor: 'magenta', borderColor: 'black'})
      hi.highlight('xref:GCN-2', null, {
        backgroundColor: 'blue'
      , backgroundOpacity: 0.5
      , borderColor: 'red'
      , borderWidth: 1
      , borderOpacity: 0.7
      })
    })

    // Call renderer
    pathInstance.render()


    $('#pathvisiojs-container2').pathvisiojs({
      fitToContainer: false
    , manualRender: true
    , sourceData: [
        // at least one item required
        {
          uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType:'biopax'
        }
      , {
          uri:'http://www.wikipathways.org//wpi/wpi.php?action=downloadFile&type=png&pwTitle=Pathway:WP1',
          fileType:'png'
        }
      , {
          uri:'http://pointer.ucsf.edu/d3/r/data-sources/gpml.php?id=WP1',
          fileType:'gpml' // generally will correspond to filename extension
        }
      ]
    })

    // Get first element from array of instances
    var pathInstance2 = $('#pathvisiojs-container2').pathvisiojs('get').pop()

    // Load plugins
    pathvisiojsNotifications(pathInstance2, {displayErrors: true, displayWarnings: true})

    // Call renderer
    pathInstance2.render()

  })
  </script>

</body>
</html>
