let plan = {
  name: "selyem_utca_szoba",
  walls: [
    {
      firstPoint: { x: 620.5256097560975, y: 20.304374999999997 },
      secondPoint: { x: 620.5256097560975, y: 625.454375 },
      size: 4.1,
      direction: "South",
    },
    {
      firstPoint: { x: 620.5256097560975, y: 625.454375 },
      secondPoint: { x: 1299.4743902439022, y: 625.454375 },
      size: 4.6,
      direction: "East",
    },
    {
      firstPoint: { x: 1299.4743902439022, y: 625.454375 },
      secondPoint: { x: 1299.4743902439022, y: 20.304374999999997 },
      size: 4.1,
      direction: "North",
    },
    {
      firstPoint: { x: 1299.4743902439022, y: 20.304374999999997 },
      secondPoint: { x: 620.5256097560975, y: 20.304374999999997 },
      size: 4.6,
      direction: "West",
    },
  ],
  beacons: [
    {
      x: 1246.3392682926826,
      y: 300.73974085365853,
      z: -1,
      furnitureOrWall: "furniture",
      furnitureIndex: 1,
      wallIndex: 0,
      distance: 0.01,
      id: "MDBT42Q 7ff2",
    },
    {
      x: 1004.2792682926828,
      y: 20.304374999999997,
      z: -1,
      furnitureOrWall: "wall",
      furnitureIndex: -1,
      wallIndex: 3,
      distance: 1.9999999999999996,
      id: "MDBT42Q f205",
    },
    {
      x: 996.8993902439024,
      y: 625.454375,
      z: -1,
      furnitureOrWall: "wall",
      furnitureIndex: -1,
      wallIndex: 1,
      distance: 2.55,
      id: "MDBT42Q 810e",
    },
    {
      x: 782.8829268292683,
      y: 401.1060823170732,
      z: -1,
      furnitureOrWall: "furniture",
      furnitureIndex: 4,
      wallIndex: 1,
      distance: 0.48,
      id: "MDBT42Q c0b0",
    },
  ],
  furnitures: [
    {
      name: "asztal",
      data: [
        {
          firstPoint: { x: 1203.535975609756, y: 64.58364329268292 },
          secondPoint: { x: 1203.535975609756, y: 299.2637652439024 },
          size: "1.59",
          direction: "South",
        },
        {
          firstPoint: { x: 1203.535975609756, y: 299.2637652439024 },
          secondPoint: { x: 1299.4743902439022, y: 299.2637652439024 },
          size: "0.65",
          direction: "East",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 299.2637652439024 },
          secondPoint: { x: 1299.4743902439022, y: 64.58364329268292 },
          size: "1.59",
          direction: "North",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 64.58364329268292 },
          secondPoint: { x: 1203.535975609756, y: 64.58364329268292 },
          size: "0.65",
          direction: "West",
        },
      ],
      products: [
        {
          stuffHere: [
            "íróasztal",
            "monitor",
            "hangfal",
            "egér",
            "billentyűzet",
          ],
        },
      ],
      separators: [
        {
          firstPoint: { x: 1203.535975609756, y: 212.18120426829267 },
          secondPoint: { x: 1299.4743902439022, y: 212.18120426829267 },
        },
      ],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 1203.535975609756, y: 64.58364329268292 },
          secondPoint: { x: 1299.4743902439022, y: 64.58364329268292 },
        },
        end: {
          firstPoint: { x: 1203.535975609756, y: 359.7787652439024 },
          secondPoint: { x: 1299.4743902439022, y: 359.7787652439024 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 3,
          furniture_index: 3,
          dist: "0.3",
          firstPoint: { x: 1135.5, y: 82 },
          secondPoint: { x: 1135.5, y: 20.304374999999997 },
        },
        vertical: {
          wall_index: 2,
          furniture_index: 2,
          dist: 0,
          firstPoint: { x: 1193, y: 159.5 },
          secondPoint: { x: 1299.4743902439022, y: 159.5 },
        },
      },
      scaled: true,
    },
    {
      name: "szekrény",
      data: [
        {
          firstPoint: { x: 1246.3392682926826, y: 299.2637652439024 },
          secondPoint: { x: 1246.3392682926826, y: 501.4724237804878 },
          size: "1.37",
          direction: "South",
        },
        {
          firstPoint: { x: 1246.3392682926826, y: 501.4724237804878 },
          secondPoint: { x: 1299.4743902439022, y: 501.4724237804878 },
          size: "0.36",
          direction: "East",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 501.4724237804878 },
          secondPoint: { x: 1299.4743902439022, y: 299.2637652439024 },
          size: "1.37",
          direction: "North",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 299.2637652439024 },
          secondPoint: { x: 1246.3392682926826, y: 299.2637652439024 },
          size: "0.36",
          direction: "West",
        },
      ],
      products: [{ stuffHere: ["MDBT42Q 7ff2", "szekrény", "ruha"] }],
      separators: [
        {
          firstPoint: { x: 1246.3392682926826, y: 446.8613262195122 },
          secondPoint: { x: 1299.4743902439022, y: 446.8613262195122 },
        },
      ],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 1246.3392682926826, y: 299.2637652439024 },
          secondPoint: { x: 1299.4743902439022, y: 299.2637652439024 },
        },
        end: {
          firstPoint: { x: 1246.3392682926826, y: 594.4588871951219 },
          secondPoint: { x: 1299.4743902439022, y: 594.4588871951219 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 1,
          furniture_index: 1,
          dist: "0.84",
          firstPoint: { x: 1246.5, y: 436 },
          secondPoint: { x: 1246.5, y: 625.454375 },
        },
        vertical: {
          wall_index: 2,
          furniture_index: 2,
          dist: 0,
          firstPoint: { x: 1276, y: 388.5 },
          secondPoint: { x: 1299.4743902439022, y: 388.5 },
        },
      },
      scaled: true,
    },
    {
      name: "komód",
      data: [
        {
          firstPoint: { x: 1225.6756097560974, y: 501.4724237804879 },
          secondPoint: { x: 1299.4743902439022, y: 501.4724237804879 },
          size: "0.5",
          direction: "East",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 501.4724237804879 },
          secondPoint: { x: 1299.4743902439022, y: 619.5504725609757 },
          size: "0.8",
          direction: "South",
        },
        {
          firstPoint: { x: 1299.4743902439022, y: 619.5504725609757 },
          secondPoint: { x: 1225.6756097560974, y: 619.5504725609757 },
          size: "0.5",
          direction: "West",
        },
        {
          firstPoint: { x: 1225.6756097560974, y: 619.5504725609757 },
          secondPoint: { x: 1225.6756097560974, y: 501.4724237804879 },
          size: "0.8",
          direction: "North",
        },
      ],
      products: [],
      separators: [],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 1225.6756097560974, y: 501.4724237804879 },
          secondPoint: { x: 1299.4743902439022, y: 501.4724237804879 },
        },
        end: {
          firstPoint: { x: 1225.6756097560974, y: 649.0699847560976 },
          secondPoint: { x: 1299.4743902439022, y: 649.0699847560976 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 1,
          furniture_index: 2,
          dist: "0.04",
          firstPoint: { x: 1247, y: 541 },
          secondPoint: { x: 1247, y: 625.454375 },
        },
        vertical: {
          wall_index: 2,
          furniture_index: 1,
          dist: 0,
          firstPoint: { x: 1287, y: 525.5 },
          secondPoint: { x: 1299.4743902439022, y: 525.5 },
        },
      },
      scaled: true,
    },
    {
      name: "ágy",
      data: [
        {
          firstPoint: { x: 620.5256097560975, y: 20.304374999999997 },
          secondPoint: { x: 864.0615853658536, y: 20.304374999999997 },
          size: "1.65",
          direction: "East",
        },
        {
          firstPoint: { x: 864.0615853658536, y: 20.304374999999997 },
          secondPoint: { x: 864.0615853658536, y: 330.25925304878047 },
          size: "2.1",
          direction: "South",
        },
        {
          firstPoint: { x: 864.0615853658536, y: 330.25925304878047 },
          secondPoint: { x: 620.5256097560975, y: 330.25925304878047 },
          size: "1.65",
          direction: "West",
        },
        {
          firstPoint: { x: 620.5256097560975, y: 330.25925304878047 },
          secondPoint: { x: 620.5256097560975, y: 20.304374999999997 },
          size: "2.1",
          direction: "North",
        },
      ],
      products: [{ stuffHere: [] }, { stuffHere: ["ágy", "párna", "takaró"] }],
      separators: [
        {
          firstPoint: { x: 620.5256097560975, y: 167.90193597560975 },
          secondPoint: { x: 864.0615853658536, y: 167.90193597560975 },
        },
        {
          firstPoint: { x: 620.5256097560975, y: 315.4994969512195 },
          secondPoint: { x: 864.0615853658536, y: 315.4994969512195 },
        },
      ],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 620.5256097560975, y: 20.304374999999997 },
          secondPoint: { x: 864.0615853658536, y: 20.304374999999997 },
        },
        end: {
          firstPoint: { x: 620.5256097560975, y: 463.0970579268292 },
          secondPoint: { x: 864.0615853658536, y: 463.0970579268292 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 3,
          furniture_index: 0,
          dist: 0,
          firstPoint: { x: 758.5, y: 34 },
          secondPoint: { x: 758.5, y: 20.304374999999997 },
        },
        vertical: {
          wall_index: 0,
          furniture_index: 3,
          dist: 0,
          firstPoint: { x: 662, y: 179 },
          secondPoint: { x: 620.5256097560975, y: 179 },
        },
      },
      scaled: true,
    },
    {
      name: "komód_2",
      data: [
        {
          firstPoint: { x: 620.5256097560975, y: 330.2592530487805 },
          secondPoint: { x: 782.8829268292683, y: 330.2592530487805 },
          size: "1.1",
          direction: "East",
        },
        {
          firstPoint: { x: 782.8829268292683, y: 330.2592530487805 },
          secondPoint: { x: 782.8829268292683, y: 404.0580335365854 },
          size: "0.5",
          direction: "South",
        },
        {
          firstPoint: { x: 782.8829268292683, y: 404.0580335365854 },
          secondPoint: { x: 620.5256097560975, y: 404.0580335365854 },
          size: "1.1",
          direction: "West",
        },
        {
          firstPoint: { x: 620.5256097560975, y: 404.0580335365854 },
          secondPoint: { x: 620.5256097560975, y: 330.2592530487805 },
          size: "0.5",
          direction: "North",
        },
      ],
      products: [{ stuffHere: ["komód2", "tv"] }],
      separators: [
        {
          firstPoint: { x: 768.1231707317073, y: 330.2592530487805 },
          secondPoint: { x: 768.1231707317073, y: 404.0580335365854 },
        },
      ],
      info: {
        direction: "horizontal",
        start: {
          firstPoint: { x: 620.5256097560975, y: 330.2592530487805 },
          secondPoint: { x: 620.5256097560975, y: 330.2592530487805 },
        },
        end: {
          firstPoint: { x: 915.7207317073171, y: 330.2592530487805 },
          secondPoint: { x: 915.7207317073171, y: 404.0580335365854 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 1,
          furniture_index: 2,
          dist: "1.5",
          firstPoint: { x: 742.5, y: 405 },
          secondPoint: { x: 742.5, y: 625.454375 },
        },
        vertical: {
          wall_index: 0,
          furniture_index: 3,
          dist: 0,
          firstPoint: { x: 628, y: 375 },
          secondPoint: { x: 620.5256097560975, y: 375 },
        },
      },
      scaled: true,
    },
    {
      name: "ruhaállvány",
      data: [
        {
          firstPoint: { x: 620.5256097560975, y: 463.0970579268293 },
          secondPoint: { x: 694.3243902439024, y: 463.0970579268293 },
          size: "0.5",
          direction: "East",
        },
        {
          firstPoint: { x: 694.3243902439024, y: 463.0970579268293 },
          secondPoint: { x: 694.3243902439024, y: 625.454375 },
          size: "1.1",
          direction: "South",
        },
        {
          firstPoint: { x: 694.3243902439024, y: 625.454375 },
          secondPoint: { x: 620.5256097560975, y: 625.454375 },
          size: "0.5",
          direction: "West",
        },
        {
          firstPoint: { x: 620.5256097560975, y: 625.454375 },
          secondPoint: { x: 620.5256097560975, y: 463.0970579268293 },
          size: "1.1",
          direction: "North",
        },
      ],
      products: [{ stuffHere: ["ruhaállvány", "blúz", "ing"] }],
      separators: [
        {
          firstPoint: { x: 620.5256097560975, y: 610.6946189024391 },
          secondPoint: { x: 694.3243902439024, y: 610.6946189024391 },
        },
      ],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 620.5256097560975, y: 463.0970579268293 },
          secondPoint: { x: 694.3243902439024, y: 463.0970579268293 },
        },
        end: {
          firstPoint: { x: 620.5256097560975, y: 758.2921798780487 },
          secondPoint: { x: 694.3243902439024, y: 758.2921798780487 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 1,
          furniture_index: 2,
          dist: 0,
          firstPoint: { x: 659, y: 566 },
          secondPoint: { x: 659, y: 625.454375 },
        },
        vertical: {
          wall_index: 0,
          furniture_index: 3,
          dist: 0,
          firstPoint: { x: 635, y: 516.5 },
          secondPoint: { x: 620.5256097560975, y: 516.5 },
        },
      },
      scaled: true,
    },
    {
      name: "asztal",
      data: [
        {
          firstPoint: { x: 1019.0390243902439, y: 355.35083841463427 },
          secondPoint: { x: 1019.0390243902439, y: 529.5159603658537 },
          size: "1.18",
          direction: "South",
        },
        {
          firstPoint: { x: 1019.0390243902439, y: 529.5159603658537 },
          secondPoint: { x: 1129.7371951219511, y: 529.5159603658537 },
          size: "0.75",
          direction: "East",
        },
        {
          firstPoint: { x: 1129.7371951219511, y: 529.5159603658537 },
          secondPoint: { x: 1129.7371951219511, y: 355.35083841463427 },
          size: "1.18",
          direction: "North",
        },
        {
          firstPoint: { x: 1129.7371951219511, y: 355.35083841463427 },
          secondPoint: { x: 1019.0390243902439, y: 355.35083841463427 },
          size: "0.75",
          direction: "West",
        },
      ],
      products: [{ stuffHere: ["asztal", "kenyér", "étkezőasztal", "vaj"] }],
      separators: [
        {
          firstPoint: { x: 1019.0390243902439, y: 502.94839939024405 },
          secondPoint: { x: 1129.7371951219511, y: 502.94839939024405 },
        },
      ],
      info: {
        direction: "vertical",
        start: {
          firstPoint: { x: 1019.0390243902439, y: 355.35083841463427 },
          secondPoint: { x: 1129.7371951219511, y: 355.35083841463427 },
        },
        end: {
          firstPoint: { x: 1019.0390243902439, y: 650.5459603658537 },
          secondPoint: { x: 1129.7371951219511, y: 650.5459603658537 },
        },
      },
      distance_from_walls: {
        horizontal: {
          wall_index: 1,
          furniture_index: 1,
          dist: "0.65",
          firstPoint: { x: 1053, y: 485 },
          secondPoint: { x: 1053, y: 625.454375 },
        },
        vertical: {
          wall_index: 2,
          furniture_index: 2,
          dist: "1.15",
          firstPoint: { x: 1116, y: 410 },
          secondPoint: { x: 1299.4743902439022, y: 410 },
        },
      },
      scaled: true,
    },
  ],
  graph: {
    adjacencyList: {
      0: [
        { node: 3, weight: 98 },
        { node: 1, weight: 108.07404868885037 },
      ],
      1: [
        { node: 0, weight: 108.07404868885037 },
        { node: 2, weight: 101.00495037373169 },
      ],
      2: [
        { node: 1, weight: 101.00495037373169 },
        { node: 16, weight: 96.17692030835673 },
        { node: 24, weight: 77.64663547121665 },
      ],
      3: [
        { node: 0, weight: 98 },
        { node: 4, weight: 75.0066663703967 },
      ],
      4: [
        { node: 5, weight: 72.11102550927978 },
        { node: 3, weight: 75.0066663703967 },
      ],
      5: [
        { node: 6, weight: 105.68348972285122 },
        { node: 4, weight: 72.11102550927978 },
        { node: 8, weight: 67.26812023536856 },
      ],
      6: [
        { node: 7, weight: 119.03780911962384 },
        { node: 5, weight: 105.68348972285122 },
        { node: 27, weight: 45.27692569068709 },
        { node: 8, weight: 64.1404708432983 },
      ],
      7: [
        { node: 15, weight: 77 },
        { node: 6, weight: 119.03780911962384 },
        { node: 32, weight: 61.032778078668514 },
        { node: 14, weight: 36.124783736376884 },
      ],
      8: [
        { node: 6, weight: 64.1404708432983 },
        { node: 5, weight: 67.26812023536856 },
        { node: 9, weight: 93.00537618869137 },
        { node: 27, weight: 78.23042886243178 },
      ],
      9: [
        { node: 8, weight: 93.00537618869137 },
        { node: 10, weight: 96.00520819205592 },
        { node: 25, weight: 80.09993757800315 },
      ],
      10: [
        { node: 26, weight: 84.0535543567314 },
        { node: 9, weight: 96.00520819205592 },
      ],
      11: [{ node: 12, weight: 51.088159097779204 }],
      12: [
        { node: 11, weight: 51.088159097779204 },
        { node: 29, weight: 68.11754546370561 },
        { node: 26, weight: 86.05230967266364 },
        { node: 13, weight: 110 },
      ],
      13: [
        { node: 12, weight: 110 },
        { node: 14, weight: 85.00588214941364 },
        { node: 30, weight: 66.007575322837 },
        { node: 25, weight: 91.08786966440702 },
      ],
      14: [
        { node: 13, weight: 85.00588214941364 },
        { node: 7, weight: 36.124783736376884 },
        { node: 31, weight: 70 },
        { node: 27, weight: 93.1933474020544 },
      ],
      15: [
        { node: 16, weight: 79.05694150420949 },
        { node: 7, weight: 77 },
        { node: 18, weight: 62.64982043070834 },
      ],
      16: [
        { node: 2, weight: 96.17692030835673 },
        { node: 15, weight: 79.05694150420949 },
        { node: 19, weight: 62.39390995922599 },
      ],
      17: [
        { node: 18, weight: 71.11258679024411 },
        { node: 20, weight: 84.29116205154607 },
      ],
      18: [
        { node: 32, weight: 70.00714249274856 },
        { node: 17, weight: 71.11258679024411 },
        { node: 15, weight: 62.64982043070834 },
        { node: 19, weight: 81.05553651663777 },
      ],
      19: [
        { node: 16, weight: 62.39390995922599 },
        { node: 18, weight: 81.05553651663777 },
        { node: 24, weight: 92 },
        { node: 20, weight: 75.0066663703967 },
      ],
      20: [
        { node: 28, weight: 90.0499861188218 },
        { node: 17, weight: 84.29116205154607 },
        { node: 21, weight: 80.00624975587844 },
        { node: 19, weight: 75.0066663703967 },
      ],
      21: [
        { node: 20, weight: 80.00624975587844 },
        { node: 22, weight: 44.598206241955516 },
        { node: 23, weight: 85.05292469985967 },
      ],
      22: [{ node: 21, weight: 44.598206241955516 }],
      23: [
        { node: 21, weight: 85.05292469985967 },
        { node: 28, weight: 80.09993757800315 },
      ],
      24: [
        { node: 19, weight: 92 },
        { node: 28, weight: 78.05767098754612 },
        { node: 2, weight: 77.64663547121665 },
      ],
      25: [
        { node: 27, weight: 83.00602387778854 },
        { node: 26, weight: 103.12128781197411 },
        { node: 13, weight: 91.08786966440702 },
        { node: 9, weight: 80.09993757800315 },
      ],
      26: [
        { node: 12, weight: 86.05230967266364 },
        { node: 10, weight: 84.0535543567314 },
        { node: 25, weight: 103.12128781197411 },
      ],
      27: [
        { node: 6, weight: 45.27692569068709 },
        { node: 25, weight: 83.00602387778854 },
        { node: 14, weight: 93.1933474020544 },
        { node: 8, weight: 78.23042886243178 },
      ],
      28: [
        { node: 24, weight: 78.05767098754612 },
        { node: 20, weight: 90.0499861188218 },
        { node: 23, weight: 80.09993757800315 },
      ],
      29: [
        { node: 12, weight: 68.11754546370561 },
        { node: 30, weight: 113.01769772916099 },
      ],
      30: [
        { node: 29, weight: 113.01769772916099 },
        { node: 31, weight: 86.14522621712709 },
        { node: 13, weight: 66.007575322837 },
      ],
      31: [
        { node: 30, weight: 86.14522621712709 },
        { node: 32, weight: 34.52535300326414 },
        { node: 14, weight: 70 },
      ],
      32: [
        { node: 31, weight: 34.52535300326414 },
        { node: 7, weight: 61.032778078668514 },
        { node: 18, weight: 70.00714249274856 },
      ],
    },
    addition: [
      {
        coordinate: { x: 1183, y: 568 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.7107362843922993 },
          vw: { wallindex: 1, distance: 3.8108650747748496 },
        },
      },
      {
        coordinate: { x: 1075, y: 564 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.6836355655622572 },
          vw: { wallindex: 1, distance: 3.079145666363712 },
        },
      },
      {
        coordinate: { x: 974, y: 565 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.6904107452697676 },
          vw: { wallindex: 1, distance: 2.3948525159051477 },
        },
      },
      {
        coordinate: { x: 1183, y: 470 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.0467686730562673 },
          vw: { wallindex: 1, distance: 3.8108650747748496 },
        },
      },
      {
        coordinate: { x: 1182, y: 395 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.5386301949929773 },
          vw: { wallindex: 1, distance: 3.8040898950673387 },
        },
      },
      {
        coordinate: { x: 1186, y: 323 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.0508172560522184 },
          vw: { wallindex: 1, distance: 3.8311906138973812 },
        },
      },
      {
        coordinate: { x: 1081, y: 311 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.969515099562092 },
          vw: { wallindex: 1, distance: 3.119796744608775 },
        },
      },
      {
        coordinate: { x: 962, y: 314 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.9898406386846237 },
          vw: { wallindex: 1, distance: 2.313550359415021 },
        },
      },
      {
        coordinate: { x: 1136, y: 278 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.7459341692142445 },
          vw: { wallindex: 1, distance: 3.4924316285218544 },
        },
      },
      {
        coordinate: { x: 1137, y: 185 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.1158424564157647 },
          vw: { wallindex: 1, distance: 3.499206808229365 },
        },
      },
      {
        coordinate: { x: 1136, y: 89 },
        nearestWall: {
          hw: { wallindex: 0, distance: 0.46542520449475344 },
          vw: { wallindex: 1, distance: 3.4924316285218544 },
        },
      },
      {
        coordinate: { x: 969, y: 32 },
        nearestWall: {
          hw: { wallindex: 0, distance: 0.07923996116665293 },
          vw: { wallindex: 1, distance: 2.3609766173675952 },
        },
      },
      {
        coordinate: { x: 966, y: 83 },
        nearestWall: {
          hw: { wallindex: 0, distance: 0.42477412624969024 },
          vw: { wallindex: 1, distance: 2.3406510782450636 },
        },
      },
      {
        coordinate: { x: 966, y: 193 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.170043894075849 },
          vw: { wallindex: 1, distance: 2.3406510782450636 },
        },
      },
      {
        coordinate: { x: 965, y: 278 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.7459341692142445 },
          vw: { wallindex: 1, distance: 2.3338758985375527 },
        },
      },
      {
        coordinate: { x: 962, y: 391 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.5115294761629348 },
          vw: { wallindex: 1, distance: 2.313550359415021 },
        },
      },
      {
        coordinate: { x: 959, y: 470 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.0467686730562673 },
          vw: { wallindex: 1, distance: 2.29322482029249 },
        },
      },
      {
        coordinate: { x: 829, y: 378 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.423452139965298 },
          vw: { wallindex: 1, distance: 1.41245145831612 },
        },
      },
      {
        coordinate: { x: 900, y: 382 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.4505528587953402 },
          vw: { wallindex: 1, distance: 1.893489217549368 },
        },
      },
      {
        coordinate: { x: 897, y: 463 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.9993424151036936 },
          vw: { wallindex: 1, distance: 1.8731636784268366 },
        },
      },
      {
        coordinate: { x: 822, y: 462 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.9925672353961827 },
          vw: { wallindex: 1, distance: 1.3650252003635464 },
        },
      },
      {
        coordinate: { x: 742, y: 463 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.9993424151036936 },
          vw: { wallindex: 1, distance: 0.8230108237627036 },
        },
      },
      {
        coordinate: { x: 709, y: 433 },
        nearestWall: {
          hw: { wallindex: 0, distance: 2.7960870238783775 },
          vw: { wallindex: 1, distance: 0.599429893414856 },
        },
      },
      {
        coordinate: { x: 739, y: 548 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.5752326902420886 },
          vw: { wallindex: 1, distance: 0.8026852846401721 },
        },
      },
      {
        coordinate: { x: 897, y: 555 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.6226589481946623 },
          vw: { wallindex: 1, distance: 1.8731636784268366 },
        },
      },
      {
        coordinate: { x: 1057, y: 189 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.1429431752458068 },
          vw: { wallindex: 1, distance: 2.9571924316285223 },
        },
      },
      {
        coordinate: { x: 1052, y: 86 },
        nearestWall: {
          hw: { wallindex: 0, distance: 0.44509966537222184 },
          vw: { wallindex: 1, distance: 2.9233165330909694 },
        },
      },
      {
        coordinate: { x: 1058, y: 272 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.7052830909691812 },
          vw: { wallindex: 1, distance: 2.9639676113360327 },
        },
      },
      {
        coordinate: { x: 819, y: 552 },
        nearestWall: {
          hw: { wallindex: 0, distance: 3.6023334090721306 },
          vw: { wallindex: 1, distance: 1.344699661241015 },
        },
      },
      {
        coordinate: { x: 898, y: 79 },
        nearestWall: {
          hw: { wallindex: 0, distance: 0.3976734074196481 },
          vw: { wallindex: 1, distance: 1.879938858134347 },
        },
      },
      {
        coordinate: { x: 900, y: 192 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.1632687143683385 },
          vw: { wallindex: 1, distance: 1.893489217549368 },
        },
      },
      {
        coordinate: { x: 895, y: 278 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.7459341692142445 },
          vw: { wallindex: 1, distance: 1.8596133190118154 },
        },
      },
      {
        coordinate: { x: 901, y: 312 },
        nearestWall: {
          hw: { wallindex: 0, distance: 1.9762902792696027 },
          vw: { wallindex: 1, distance: 1.9002643972568787 },
        },
      },
    ],
  },
  scale: 147.59756097560975,
};
