var pathvisioNS = pathvisioNS || {};
pathvisioNS["tmp/pathvisiojs.html"] = '<div id="pathvisio-js-container" style="width: inherit; min-width: inherit; max-width: inherit; height: inherit; min-height: inherit; max-height: inherit; position: absolute; ">\n\n    <!-- **********************************************************************\n    Pathway Container (JavaScript inserts pathway image inside this div)\n    *********************************************************************** -->\n\n    <div id="pathway-container" style="width: inherit; min-width: inherit; max-width: inherit; height: inherit; min-height: inherit; max-height: inherit; " class="y-mid">\n\n      <svg id="pathway-svg" version="1.1" baseProfile="full" xmlns="http://www.w3.org/1999/xlink" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" width="500px" height="500px" style="display: inline; width: inherit; min-width: inherit; max-width: inherit; height: inherit; min-height: inherit; max-height: inherit; " preserveAspectRatio="xMidYMid" onmouseup="svgPanZoom.handleMouseUp(evt)" onmousedown="svgPanZoom.handleMouseDown(evt)" onmousemove="svgPanZoom.handleMouseMove(evt)" xlink="http://www.w3.org/1999/xlink" ev="http://www.w3.org/2001/xml-events">\n\n        <g>\n        <title>pathvisiojs pathway diagram</title>\n        <desc>\n          This SVG file contains all the graphical elements (markers and symbols in defs as well as\n          style data) used by the program pathvisiojs, which has two components: \n          1) a viewer for transforming GPML biological pathway data into an SVG visual representation and \n          2) an editor for creating both views and models for biological pathways.\n        </desc>\n        </g>\n        <defs>\n\n          <filter id="highlight" width="150%" height="150%">\n            <feOffset result="offOut" in="SourceGraphic" dx="30" dy="30"></feOffset>\n              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10"></feGaussianBlur>\n            <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\n          </filter>\n\n        <marker id="shape-library-markers-arrow-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-arrow-svg-start-default" class="solid-stroke default-fill-color">\n\n	<!-- arrow markers: triangular polygons, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,11 0,6 12,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-arrow-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-arrow-svg-end-default" class="solid-stroke default-fill-color" transform="rotate(180, 6, 6)">\n\n	<!-- arrow markers: triangular polygons, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,11 0,6 12,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-necessary-stimulation-svg-start-default" preserveAspectRatio="none" viewBox="0 0 16 12" markerWidth="16" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-necessary-stimulation-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-necessary-stimulation markers: triangular polygons, drawing-board fill, default color stroke; and vertical line -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<line fill="none" stroke-width="1" x1="14" y1="0" x2="14" y2="12"></line>\n	<line fill="none" stroke="none" x1="16" y1="6" x2="16" y2="6"></line> <!-- dummy point -->\n	<polygon stroke-width="1" points="0,6 9,11 9,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-necessary-stimulation-svg-end-default" preserveAspectRatio="none" viewBox="0 0 16 12" markerWidth="16" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="16" refY="6"><g id="g-src-shape-library-markers-mim-necessary-stimulation-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 8, 6)">\n\n	<!-- mim-necessary-stimulation markers: triangular polygons, drawing-board fill, default color stroke; and vertical line -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<line fill="none" stroke-width="1" x1="14" y1="0" x2="14" y2="12"></line>\n	<line fill="none" stroke="none" x1="16" y1="6" x2="16" y2="6"></line> <!-- dummy point -->\n	<polygon stroke-width="1" points="0,6 9,11 9,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-binding-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-binding-svg-start-default" class="solid-stroke default-fill-color">\n\n	<!-- mim-binding markers: four-point polygon, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,12 0,6 12,0 5,6 "></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-binding-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-binding-svg-end-default" class="solid-stroke default-fill-color" transform="rotate(180, 6, 6)">\n\n	<!-- mim-binding markers: four-point polygon, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,12 0,6 12,0 5,6 "></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-conversion-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-conversion-svg-start-default" class="solid-stroke default-fill-color">\n\n	<!-- mim-conversion markers: triangular polygons, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,11 0,6 12,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-conversion-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-conversion-svg-end-default" class="solid-stroke default-fill-color" transform="rotate(180, 6, 6)">\n\n	<!-- mim-conversion markers: triangular polygons, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,11 0,6 12,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-stimulation-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-stimulation-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-stimulation markers: triangular polygons, drawing-board fill, default color stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<line stroke="none" fill="none" x1="12" y1="6" x2="12" y2="6"></line> <!-- dummy point -->\n	<polygon stroke-width="1" points="0,6 11,11 11,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-stimulation-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-stimulation-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 6, 6)">\n\n	<!-- mim-stimulation markers: triangular polygons, drawing-board fill, default color stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<line stroke="none" fill="none" x1="12" y1="6" x2="12" y2="6"></line> <!-- dummy point -->\n	<polygon stroke-width="1" points="0,6 11,11 11,1"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-modification-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-modification-svg-start-default" class="default-fill-color solid-stroke">\n\n	<!-- mim-modification markers: four-point polygon, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,12 0,6 12,0 5,6 "></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-modification-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-modification-svg-end-default" class="default-fill-color solid-stroke" transform="rotate(180, 6, 6)">\n\n	<!-- mim-modification markers: four-point polygon, no stroke -->\n\n	<rect class="board-fill-color" stroke="none" x="0" y="5.4" width="2" height="1.2"></rect>\n	<polygon stroke-width="0" points="12,12 0,6 12,0 5,6 "></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-catalysis-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="0" refY="6"><g id="g-src-shape-library-markers-mim-catalysis-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-catalysis markers: circle, drawing-board fill and default color stroke -->\n\n	<circle cx="6.1" cy="6" r="5.3px" stroke-width="1px"></circle>\n\n</g></marker><marker id="shape-library-markers-mim-catalysis-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-catalysis-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 6, 6)">\n\n	<!-- mim-catalysis markers: circle, drawing-board fill and default color stroke -->\n\n	<circle cx="6.1" cy="6" r="5.3px" stroke-width="1px"></circle>\n\n</g></marker><marker id="shape-library-markers-mim-inhibition-svg-start-default" preserveAspectRatio="none" viewBox="0 0 10 20" markerWidth="10" markerHeight="20" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="10"><g id="g-src-shape-library-markers-mim-inhibition-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-inhibition markers: vertical line; and extended drawing-board rect -->\n	\n	<rect stroke="none" x="0" y="9" width="8" height="2"></rect>\n	<line fill="none" stroke-width="1.8" x1="7" y1="0" x2="7" y2="20"></line>\n\n</g></marker><marker id="shape-library-markers-mim-inhibition-svg-end-default" preserveAspectRatio="none" viewBox="0 0 10 20" markerWidth="10" markerHeight="20" markerUnits="strokeWidth" orient="auto" refX="10.5" refY="10"><g id="g-src-shape-library-markers-mim-inhibition-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 5, 10)">\n\n	<!-- mim-inhibition markers: vertical line; and extended drawing-board rect -->\n	\n	<rect stroke="none" x="0" y="9" width="8" height="2"></rect>\n	<line fill="none" stroke-width="1.8" x1="7" y1="0" x2="7" y2="20"></line>\n\n</g></marker><marker id="shape-library-markers-mim-cleavage-svg-start-default" preserveAspectRatio="none" viewBox="0 0 20 30" markerWidth="20" markerHeight="30" markerUnits="strokeWidth" orient="auto" refX="9" refY="15"><g id="g-src-shape-library-markers-mim-cleavage-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-cleavage markers: two lines and extended drawing-board rect -->\n\n	<rect stroke="none" x="0" y="14.3" width="18.4" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="18" y1="14.5" x2="18" y2="30"></line>	\n	<line fill="none" stroke-width="1" x1="18" y1="30" x2="0" y2="0"></line>	\n\n\n</g></marker><marker id="shape-library-markers-mim-cleavage-svg-end-default" preserveAspectRatio="none" viewBox="0 0 20 30" markerWidth="20" markerHeight="30" markerUnits="strokeWidth" orient="auto" refX="10" refY="15"><g id="g-src-shape-library-markers-mim-cleavage-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 10, 15)">\n\n	<!-- mim-cleavage markers: two lines and extended drawing-board rect -->\n\n	<rect stroke="none" x="0" y="14.3" width="18.4" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="18" y1="14.5" x2="18" y2="30"></line>	\n	<line fill="none" stroke-width="1" x1="18" y1="30" x2="0" y2="0"></line>	\n\n\n</g></marker><marker id="shape-library-markers-mim-covalent-bond-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="6"><g id="g-src-shape-library-markers-mim-covalent-bond-svg-start-default" class="solid-stroke default-fill-color">\n\n	<!-- mim-covalent-bond markers: not much to see here! -->\n	<rect x="0" y="0" width="0" height="0" stroke="none" fill="none" stroke-width="0"></rect>\n\n</g></marker><marker id="shape-library-markers-mim-covalent-bond-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="11" refY="6"><g id="g-src-shape-library-markers-mim-covalent-bond-svg-end-default" class="solid-stroke default-fill-color" transform="rotate(180, 6, 6)">\n\n	<!-- mim-covalent-bond markers: not much to see here! -->\n	<rect x="0" y="0" width="0" height="0" stroke="none" fill="none" stroke-width="0"></rect>\n\n</g></marker><marker id="shape-library-markers-mim-transcription-translation-svg-start-default" preserveAspectRatio="none" viewBox="0 0 20 24" markerWidth="20" markerHeight="24" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="12"><g id="g-src-shape-library-markers-mim-transcription-translation-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-transcription-translation markers: two lines and an open trigular polygon, plus extended drawing-board rect -->\n\n	<rect stroke="none" x="0" y="11" width="12" height="2"></rect>\n	<line fill="none" stroke-width="1" x1="15" y1="12" x2="15" y2="5"></line>\n	<line fill="none" stroke-width="1" x1="15.5" y1="5" x2="8" y2="5"></line>\n	<polygon stroke-width="1" points="0,5 8,1 8,9"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-transcription-translation-svg-end-default" preserveAspectRatio="none" viewBox="0 0 20 24" markerWidth="20" markerHeight="24" markerUnits="strokeWidth" orient="auto" refX="20.5" refY="12"><g id="g-src-shape-library-markers-mim-transcription-translation-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 10, 12)">\n\n	<!-- mim-transcription-translation markers: two lines and an open trigular polygon, plus extended drawing-board rect -->\n\n	<rect stroke="none" x="0" y="11" width="12" height="2"></rect>\n	<line fill="none" stroke-width="1" x1="15" y1="12" x2="15" y2="5"></line>\n	<line fill="none" stroke-width="1" x1="15.5" y1="5" x2="8" y2="5"></line>\n	<polygon stroke-width="1" points="0,5 8,1 8,9"></polygon>\n\n</g></marker><marker id="shape-library-markers-mim-gap-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="0" refY="6"><g id="g-src-shape-library-markers-mim-gap-svg-start-default" class="board-fill-color solid-stroke">\n\n	<!-- mim-gap markers: just an extended drawing-board rect -->\n	<!-- \n	TODO This could be refactored to make the shape match the viewbox.\n	It can overlap the side of the shape, blanking out a small part of it when the edge is at an angle.\n	-->\n\n	<rect stroke="none" x="0.5" y="5.3" width="8" height="1.4"></rect>\n\n</g></marker><marker id="shape-library-markers-mim-gap-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="12" refY="6"><g id="g-src-shape-library-markers-mim-gap-svg-end-default" class="board-fill-color solid-stroke" transform="rotate(180, 6, 6)">\n\n	<!-- mim-gap markers: just an extended drawing-board rect -->\n	<!-- \n	TODO This could be refactored to make the shape match the viewbox.\n	It can overlap the side of the shape, blanking out a small part of it when the edge is at an angle.\n	-->\n\n	<rect stroke="none" x="0.5" y="5.3" width="8" height="1.4"></rect>\n\n</g></marker><marker id="shape-library-markers-t-bar-svg-start-default" preserveAspectRatio="none" viewBox="0 0 10 20" markerWidth="10" markerHeight="20" markerUnits="strokeWidth" orient="auto" refX="-0.5" refY="10"><g id="g-src-shape-library-markers-t-bar-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n        <!-- t-bar markers: vertical line; and extended drawing-board rect -->\n	\n	<rect stroke="none" x="0" y="9" width="8" height="2"></rect>\n	<line fill="none" stroke-width="1.8" x1="7" y1="0" x2="7" y2="20"></line>\n\n</g></marker><marker id="shape-library-markers-t-bar-svg-end-default" preserveAspectRatio="none" viewBox="0 0 10 20" markerWidth="10" markerHeight="20" markerUnits="strokeWidth" orient="auto" refX="10.5" refY="10"><g id="g-src-shape-library-markers-t-bar-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 5, 10)">\n\n        <!-- t-bar markers: vertical line; and extended drawing-board rect -->\n	\n	<rect stroke="none" x="0" y="9" width="8" height="2"></rect>\n	<line fill="none" stroke-width="1.8" x1="7" y1="0" x2="7" y2="20"></line>\n\n</g></marker><marker id="shape-library-markers-none-svg-start-default" preserveAspectRatio="none" viewBox="0 0 0 0" markerWidth="0" markerHeight="0" markerUnits="strokeWidth" orient="auto" refX="0" refY="6"><g id="g-src-shape-library-markers-none-svg-start-default" class="board-fill-color board-stroke-color node shape">\n\n	<rect x="0" y="0" width="0" height="0" stroke="none" fill="none" stroke-width="0"></rect>\n\n</g></marker><marker id="shape-library-markers-none-svg-end-default" preserveAspectRatio="none" viewBox="0 0 0 0" markerWidth="0" markerHeight="0" markerUnits="strokeWidth" orient="auto" refX="11" refY="6"><g id="g-src-shape-library-markers-none-svg-end-default" class="board-fill-color board-stroke-color node shape" transform="rotate(180, 0, 0)">\n\n	<rect x="0" y="0" width="0" height="0" stroke="none" fill="none" stroke-width="0"></rect>\n\n</g></marker><marker id="shape-library-markers-mim-branching-left-svg-start-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="0.4" refY="6"><g id="g-src-shape-library-markers-mim-branching-left-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-branching-left markers: line and extended drawing-board rect -->\n\n	<rect stroke="none" x="0.9" y="5.3" width="2.6" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="3.9" y1="6.2" x2="0.2" y2="0"></line>	\n\n</g></marker><marker id="shape-library-markers-mim-branching-left-svg-end-default" preserveAspectRatio="none" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="11.6" refY="6"><g id="g-src-shape-library-markers-mim-branching-left-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 6, 6)">\n\n	<!-- mim-branching-left markers: line and extended drawing-board rect -->\n\n	<rect stroke="none" x="0.9" y="5.3" width="2.6" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="3.9" y1="6.2" x2="0.2" y2="0"></line>	\n\n</g></marker><marker id="shape-library-markers-mim-branching-right-svg-start-default" preserveAspectRatio="none" viewBox="0 0 4 12" markerWidth="4" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="0.4" refY="6"><g id="g-src-shape-library-markers-mim-branching-right-svg-start-default" class="board-fill-color default-stroke-color solid-stroke">\n\n	<!-- mim-branching-right markers: line and extended drawing-board rect -->\n\n	<rect stroke="none" x="0.9" y="5.3" width="2.6" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="0.2" y1="12" x2="3.9" y2="5.8"></line>	\n\n</g></marker><marker id="shape-library-markers-mim-branching-right-svg-end-default" preserveAspectRatio="none" viewBox="0 0 4 12" markerWidth="4" markerHeight="12" markerUnits="strokeWidth" orient="auto" refX="3.6" refY="6"><g id="g-src-shape-library-markers-mim-branching-right-svg-end-default" class="board-fill-color default-stroke-color solid-stroke" transform="rotate(180, 2, 6)">\n\n	<!-- mim-branching-right markers: line and extended drawing-board rect -->\n\n	<rect stroke="none" x="0.9" y="5.3" width="2.6" height="1.4"></rect>\n	<line fill="none" stroke-width="1" x1="0.2" y1="12" x2="3.9" y2="5.8"></line>	\n\n</g></marker><style type="text/css">	svg {\n		color-interpolation: auto;\n		image-rendering: auto;\n		shape-rendering: auto;\n		vector-effect: non-scaling-stroke;\n                background: white;\n	/* removed fill and stroke since they override marker specs */\n	/*	fill: white;\n    		stroke: black; */\n	}\n\n	/* default color for pathway elements */\n	.default-fill-color {\n		fill: black; \n	}\n	.default-stroke-color {\n		stroke: black;\n	}\n	\n	/* default color of the background drawing board */ 	\n	.board-fill-color {\n		fill: white;\n	}\n	.board-stroke-color {\n		stroke: white;\n	}\n\n	.text-area {\n		font-family: Sans-Serif, Helvetica, Arial;\n		text-align: center;\n		vertical-align: middle;\n		font-size: 10px;\n		fill: black;\n		fill-opacity: 1;\n		stroke: none;\n	}\n\n	.citation {\n		font-family: Sans-Serif, Helvetica, Arial;\n		text-align: center;\n		vertical-align: top;\n		font-size: 7px;\n		fill: #999999;\n		fill-opacity: 1;\n		stroke: none;\n	}\n\n	.info-box {\n		font-family: Sans-Serif;\n		font-size: 10px;\n		fill: black;\n		stroke: none;\n		text-align: left;\n		vertical-align: top;\n	}\n\n	.info-box-item-property-name {\n		font-weight: bold;\n	}\n\n	.info-box-item-property-value {\n	}\n\n	.data-node {\n		text-align: right;\n		fill-opacity: 1;\n		fill: white;\n		stroke: black;\n		stroke-width: 1;\n		stroke-dasharray: 0;\n		stroke-miterlimit: 1;\n    		pointer-events:auto;\n	}\n	\n	.has-xref:hover {\n		cursor: pointer;\n	}\n\n	.data-node.gene-product {\n	}\n\n	.metabolite {\n		stroke: blue;\n	}\n\n	.data-node.metabolite &gt; .text-area {\n		fill: blue;\n		fill-opacity: 1;\n		stroke: none;\n	}\n\n	.data-node.pathway {\n		stroke: none;\n		fill-opacity: 0;\n	}\n\n	.data-node.pathway &gt; .text-area {\n		fill: rgb(20,150,30);\n		fill-opacity: 1;\n		font-size: 12px;\n		font-weight: bold;\n	}\n\n	.data-node.protein {\n	}\n\n	.data-node.rna {\n	}\n\n	.data-node.unknown {\n	}\n\n	.label {\n		stroke: null;\n		stroke-width: 0;\n		fill-opacity: 0;\n		stroke-dasharray: 0;\n		stroke-miterlimit: 1;\n	}\n\n	.shape {\n		fill-opacity: 0;\n		stroke: black;\n		stroke-dasharray: 0;\n		stroke-miterlimit: 1;\n	}\n\n	.shape.none {\n		fill: none;\n		fill-opacity: 0;\n		stroke: none;\n	}\n\n	g.group-node &gt; .shape {\n		fill-opacity: 0.098;\n		stroke: gray;\n		stroke-miterlimit: 1;\n		stroke-width: 1px;\n    		pointer-events:none;\n	}\n\n	.group-node {\n		fill-opacity: 0.098;\n		stroke: gray;\n		stroke-miterlimit: 1;\n		stroke-width: 1px;\n    		pointer-events:none;\n	}\n\n	.group-node &gt; .text-area {\n		fill-opacity: 0.4;\n		font-family: Serif, Times;\n		font-size: 32px;\n		fill: black;\n		stroke-width: 0;\n		font-weight: bold;\n  	}	\n\n	.group-node.none {\n		fill: rgb(180,180,100);\n		stroke-dasharray: 5,3;\n	}\n\n	.group-node.none &gt; .text-area {\n		display: none;\n  	}	\n\n	/*.group-node.none:hover {\n		fill: rgb(255,180,100);\n		fill-opacity: 0.05;\n	}*/\n\n	.group-node.group {\n		fill-opacity: 0;\n		stroke: none;\n	}\n\n	.group-node.group &gt; .text-area {\n		display: none;\n  	}\n	/*.group-node.group:hover {\n		fill: rgb(0,0,255);\n		stroke-width: 1px;\n		stroke-dasharray: 5,3;\n		stroke: gray;\n		fill-opacity: 0.1;\n	}*/\n\n	.group-node.complex {\n		fill: rgb(180,180,100);\n	}\n\n	.group-node.complex &gt; .text-area {\n		display: none;\n  	}\n	/*.group-node.complex:hover {\n		fill: rgb(255,0,0);\n		fill-opacity: 0.05;\n	}*/	\n\n  	.group-node.pathway {\n		fill: rgb(0,255,0);\n		stroke-dasharray: 5,3;\n	}\n	/*.group-node.pathway:hover {\n		fill: rgb(0,255,0);\n		fill-opacity: 0.2;\n	}*/\n	.group-node.pathway &gt; .text-area {\n		fill: rgb(20,150,30);\n		stroke: rgb(20,150,30);\n  }\n\n  .cellular-component {\n		fill-opacity: 0;\n		stroke: silver;\n	}\n\n  .graphical-line {\n		fill:none;\n		stroke: black; \n		stroke-width: 1px; \n	}\n\n	.interaction {\n		fill:none;\n		stroke: black; \n		stroke-width: 1px; \n	}\n\n	marker {\n		/* this is what should work per the spec\n		   stroke-dasharray: none; */\n		/* but I need to add this to make it work in Safari */\n		stroke-dasharray: 9999999999999999999999999;\n	}\n\n  .marker-end {\n    -webkit-transform: rotate(180deg);\n    -webkit-transform-origin: 50% 50%;\n\n    -o-transform: rotate(180deg); \n    -o-transform-origin: 50% 50%;\n\n    transform: rotate(180deg);\n    transform-origin: 50% 50%;\n  }\n\n	.solid-stroke {\n		/* this is what should work per the spec\n		   stroke-dasharray: none; */\n		/* but I need to add this to make it work in Safari */\n		stroke-dasharray: 9999999999999999999999999;\n	}\n\n	.dashed-stroke {\n		stroke-dasharray: 5,3;\n	}\n\n  .highlighted-node {\n		fill: yellow;\n    fill-opacity: 0.2;\n		stroke: orange; \n    stroke-width: 3px;\n  }\n</style></defs>\n\n        <g id="viewport" transform="matrix(0.8630183945977313,0,0,0.8630183945977313,10,20)">\n        </g>\n\n      </svg>\n\n    \n      \n    </div>\n    \n    <div id="typeahead" style="position: absolute; top: 5px; right: 5px;">\n    <!-- **********************************************************************\n      Highlight Element by Label Control\n      *********************************************************************** -->\n\n      <span class="twitter-typeahead" style="position: relative; display: inline-block;"><input class="tt-hint" type="text" autocomplete="off" spellcheck="off" disabled="" style="position: absolute; top: 0px; left: 0px; border-color: transparent; box-shadow: none; background-attachment: scroll; background-clip: border-box; background-color: rgb(255, 255, 255); background-image: none; background-origin: padding-box; background-size: auto; background-position: 0% 0%; background-repeat: repeat repeat;"><input id="highlight-by-label-input" placeholder="Enter node name to highlight." role="textbox" aria-autocomplete="list" aria-haspopup="true" class="tt-query" autocomplete="off" spellcheck="false" dir="auto" style="position: relative; vertical-align: top; background-color: transparent;"><span style="position: absolute; left: -9999px; visibility: hidden; white-space: nowrap; font-family: \'Lucida Grande\'; font-size: 12px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;"></span><span class="tt-dropdown-menu" style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none;"></span></span>\n\n      </div> \n     \n   \n      <!-- **********************************************************************\n      Pan Zoom Control\n      see http://bumbu.github.io/cytoscape.js/debug/ for example of cytoscape.js \n      *********************************************************************** -->\n\n    <!--  <div id="pan-zoom-control" class="ui-cytoscape-panzoom">\n        <div class="ui-cytoscape-panzoom-zoom-in ui-cytoscape-panzoom-zoom-button">\n          <span class="icon icon-plus"></span>\n        </div>\n        <div class="ui-cytoscape-panzoom-zoom-out ui-cytoscape-panzoom-zoom-button">\n          <span class="icon icon-minus"></span>\n        </div>\n        <div class="ui-cytoscape-panzoom-reset ui-cytoscape-panzoom-zoom-button">\n          <span class="icon icon-resize-full"></span>\n        </div>\n        <div class="ui-cytoscape-panzoom-slider">\n          <div class="ui-cytoscape-panzoom-slider-background">\n          </div>\n          <div class="ui-cytoscape-panzoom-slider-handle" style="top: 42.80000001192093px;">\n            <span class="icon icon-minus"></span>\n          </div>\n          <div class="ui-cytoscape-panzoom-no-zoom-tick" style="top: 42.80000001192093px;">\n          </div>\n        </div>\n        <div class="ui-cytoscape-panzoom-panner">\n          <div class="ui-cytoscape-panzoom-panner-handle">\n          </div>\n          <div class="ui-cytoscape-panzoom-pan-up ui-cytoscape-panzoom-pan-button">\n          </div>\n          <div class="ui-cytoscape-panzoom-pan-down ui-cytoscape-panzoom-pan-button">\n          </div>\n          <div class="ui-cytoscape-panzoom-pan-left ui-cytoscape-panzoom-pan-button">\n          </div>\n          <div class="ui-cytoscape-panzoom-pan-right ui-cytoscape-panzoom-pan-button">\n          </div>\n          <div class="ui-cytoscape-panzoom-pan-indicator" style="display: none; left: 22.424611085682006px; top: 0.12287108520014556px; background-color: rgb(127, 127, 127); background-position: initial initial; background-repeat: initial initial;">\n          </div>\n        </div>\n      </div>\n	-->\n      <!-- **********************************************************************\n      Fullscreen Control \n      *********************************************************************** -->\n\n      <div id="fit-to-screen-control" style="position: absolute; bottom: 5px; right: 8px;">                           \n        <img class="icon-screenshot" style="color:#aaa" src="../src/img/fitscreen_icon.png">                                                        \n      </div>\n    <!--  <div id="fullscreen-control" style="position: absolute; bottom: 5px; right: 5px;">\n        <i class="icon-fullscreen" style="color:#aaa"></i>\n      </div>\n    -->\n\n    <div id="viewer-toolbar" style="position: absolute; top: 0px; right: 0px; height: inherit">\n    </div>\n      \n    <!-- **********************************************************************\n    Details Frame\n    *********************************************************************** -->\n\n    <div id="annotation" class="annotation ui-draggable" style="visibility: hidden; position: absolute; right: 75px; top: 100px;">\n      <header class="annotation-header">\n      <span id="annotation-move" class="annotation-header-move">\n        <i class="icon-move"></i>\n      </span>\n      <span class="annotation-header-close">                                                                                    \n        <i class="icon-remove"></i>                                                                                                                             \n      </span>   \n      <span id="annotation-header-text" class="annotation-header-text">\n        Header\n      </span> \n      <span id="annotation-header-search" class="annotation-header-search" title="Search for pathways containing \'Header Text\'">\n        <a href="http://wikipathways.org//index.php?title=Special:SearchPathways">\n          <i class="icon-search" style="color:blue; font-size:50% ; text-decoration:none"></i>\n        </a>\n      </span>\n      <div id="annotation-description" class="annotation-description">\n        <h2>description</h2>\n      </div>\n      </header>\n      <span class="annotation-items-container">\n        <ul id="annotation-items-container">\n          <!-- List items inside this ul element are generated automatically by JavaScript.\n          Each item will be composed of a title and text. The text can be set to be an href.\n          You can edit the styling of the title by editing CSS class "annotation-item-title"\n          and the styling of the text by editing CSS class "annotation-item-text.\n          -->\n        </ul>\n      </span>\n    </div>\n  </div>\n';
