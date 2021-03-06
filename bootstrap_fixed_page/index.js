$(function () {
  initializeSidebar();
  initializeContents();
  initializeDialog();
  initializeSecondDialog();
});

function initializeSidebar() {
  $('#menuButton').on('click', e => {
    $('.contentLeft').toggleClass('menu-collapse');
    $('.contentRight').toggleClass('menu-collapse');
  });

  buildTree();

  expandTargetNode();

  $('#orientationButton').on('click', e => {
    togglePrintOrientation();
    $('#orientationLabel').text(isPrintOrientationPortrait() ? 'Portrait' : 'Landscape');
  });
}

function getTree() {
  // To select target node, added 'targetid' property.
  const tree = [
    {
      text: 'Parent 1',
      nodes: [
        {
          text: 'Child 1',
          nodes: [
            {
              text: 'Grandchild 1',
              href: 'index.html?targetid=2',
              targetid: 2,
            },
            {
              text: 'Grandchild 2',
              href: 'index.html?targetid=3',
              targetid: 3,
            },
          ],
        },
        {
          text: 'Child 2',
          href: 'index.html?targetid=4',
          targetid: 4,
        },
      ],
    },
    {
      text: 'Parent 2',
      nodes: [
        {
          text: 'Child 1',
          nodes: [
            {
              text: 'Grandchild 1',
              href: 'index.html?targetid=7',
              targetid: 7,
            },
            {
              text: 'Grandchild 2',
              href: 'index.html?targetid=8',
              targetid: 8,
            },
          ],
        },
        {
          text: 'Child 2',
          href: 'index.html?targetid=9',
          targetid: 9,
        },
      ],
    },
    {
      text: 'Parent 3',
      nodes: [
        {
          text: 'Child 1',
          nodes: [
            {
              text: 'Grandchild 1',
              href: 'index.html?targetid=12',
              targetid: 12,
            },
            {
              text: 'Grandchild 2',
              href: 'index.html?targetid=13',
              targetid: 13,
            },
          ],
        },
        {
          text: 'Child 2',
          href: 'index.html?targetid=14',
          targetid: 14,
        },
      ],
    },
    {
      text: 'Parent 4',
      href: 'index.html?targetid=15',
      targetid: 15,
    },
    {
      text: 'Parent 5',
      href: 'index.html?targetid=16',
      targetid: 16,
    },
    {
      text: 'Parent 6',
      href: 'index.html?targetid=17',
      targetid: 17,
    },
    {
      text: 'Parent 7',
      href: 'index.html?targetid=18',
      targetid: 18,
    },
    {
      text: 'Parent 8',
      href: 'index.html?targetid=19',
      targetid: 19,
    },
    {
      text: 'Parent 9',
      href: 'index.html?targetid=20',
      targetid: 20,
    },
  ];
  return tree;
}

/**
 * build tree on sidebar.
 */
function buildTree() {
  const tree = getTree();
  const targetid = getTargetId();
  if (targetid) {
    setTargetNodeStyle(targetid, tree);
  }

  $('#tree').treeview({
    data: tree, // data is not optional
    levels: 5, // expand all to search target node
    collapseIcon: 'bi bi-caret-down',
    expandIcon: 'bi bi-caret-right',
    enableLinks: true,
    showBorder: false,
    backColor: 'transparent',
    onNodeSelected: (event, data) => {
      if (data.nodes) {
        // If this is not leaf, unselect
        $('#tree').treeview('unselectNode', [data.nodeId, { silent: true }]);
      } else {
        // move page when clicked item background too
        location.href = data.href;
      }
      $('#tree').treeview('toggleNodeExpanded', [data.nodeId, { silent: true }]);
    },
  });
}

/**
 * get target information.
 * @returns targetid
 */
function getTargetId() {
  // example: query string includes targetid
  const qparam = [...new URLSearchParams(document.location.search).entries()].reduce(
    (obj, e) => ({ ...obj, [e[0]]: e[1] }),
    {}
  );
  if (qparam || qparam.targetid) {
    return qparam.targetid;
  }
}

function setTargetNodeStyle(targetid, nodes) {
  for (const nodeidx in nodes) {
    const node = nodes[nodeidx];
    if (node.href && node.targetid == targetid) {
      node.backColor = '#428bca';
      node.color = '#FFFFFF';
      return true;
    } else if (node.nodes) {
      let res = setTargetNodeStyle(targetid, node.nodes);
      if (res) {
        // break;
        return true;
      }
    }
  }
  return false;
}

function expandTargetNode() {
  const nodeid = getTargetNodeid();
  // collapse all then expand only target node
  $('#tree').treeview('collapseAll', { silent: true });
  if (nodeid) {
    $('#tree').treeview('revealNode', [nodeid, { silent: true }]);
  }
}

/**
 * search tree node that matches target information
 * @returns nodeid
 */
function getTargetNodeid() {
  const targetid = getTargetId();
  if (targetid) {
    return $(`#tree li a[href$="index.html?targetid=${targetid}"]`).parent().data('nodeid');
  }
}

/**
 *
 * @returns printLandscape.css is disabled?
 */
function isPrintOrientationPortrait() {
  return $('link[title="printLandscape"]').attr('disabled');
}

/**
 * toggle printLandscape.css
 */
function togglePrintOrientation() {
  // disable printLandscape when landscape
  $('link[title="printLandscape"]').attr('disabled', !isPrintOrientationPortrait());
}

function initializeContents() {
  $('#onceButton').on('click', () => {
    $('#onceButton').attr('disabled', 1);
    $('#onceSpinner').removeClass('d-none');
    window.setTimeout(() => {
      $('#onceButton').removeAttr('disabled');
      $('#onceSpinner').addClass('d-none');
    }, 5000);
  });
}

function initializeDialog() {
  $('#dialog').dialog({
    autoOpen: false,
    modal: true,
    width: 440,
    // height: 440,
    open: function (event, ui) {
      // set overlay color
      $('.ui-widget-overlay').css({
        opacity: 0.3,
        backgroundColor: 'black',
      });

      // initialize inputs
      $('#colorSelect').val(0);
      $('#userInput').val('');
    },
    buttons: [
      {
        text: 'OK',
        click: function () {
          $('#selectedColor').text($('#colorSelect option:selected').text());
          $('#selectedUsers').text($('#userInput').val());
          $(this).dialog('close');
        },
      },
      {
        text: 'Cancel',
        click: function () {
          $(this).dialog('close');
        },
      },
    ],
  });

  $('#dialogButton').on('click', () => {
    // show dialog
    $('#dialog').dialog('open');
  });
  $('#userButton').on('click', () => {
    // show dialog
    $('#second-dialog').dialog('open');
  });
}

function initializeSecondDialog() {
  $('#second-dialog').dialog({
    autoOpen: false,
    modal: true,
    width: 440,
    // height: 440,
    open: function (event, ui) {
      // It's no need to set overlay because of parent dialog
      // set overlay color
      // $('.ui-widget-overlay').css({
      //   opacity: 0,
      //   backgroundColor: 'black',
      // });

      // initialize inputs
      // clear selection
      $('#userTable .ui-selected').removeClass('ui-selected');
    },
    buttons: [
      {
        text: 'OK',
        click: function () {
          // join selected value
          $('#userInput').val(
            [...$('#userTable > tbody > tr.ui-selectee.ui-selected > td:nth-child(2)')]
              .map(e => e.textContent)
              .join(', ')
          );
          $(this).dialog('close');
        },
      },
      {
        text: 'Cancel',
        click: function () {
          $(this).dialog('close');
        },
      },
    ],
  });

  $('#dialogButton').on('click', () => {
    // show dialog
    $('#dialog').dialog('open');
  });

  $('#userTable').stickyTableHeaders({ scrollableArea: $('.userTableContainer')[0] });

  // selectable rows
  $('#userTable').selectable({
    filter: 'tr',
    // // select one item only
    // selected: function(event, ui) {
    //     $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected").each(
    //         function(key,value){
    //             $(value).find('*').removeClass("ui-selected");
    //         }
    //     );
    // }
  });
}
