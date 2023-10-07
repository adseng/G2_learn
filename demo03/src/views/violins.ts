import Konva from "konva";

fetch("/data/violins2.json")
    .then((res) => res.json())
    .then((data) => {
        // data[0].data[0] 偶数为值，奇数为密度
        drewChart({container: "app", width: 500, height: 400, data: data});
    });

function drewChart({
                       container,
                       width,
                       height,
                       data,
                   }: {
    container: string;
    width: number;
    height: number;
    data: { id: string, data: number[] }[];
}) {
    // 初始化舞台
    const stage = new Konva.Stage({
        container,
        width,
        height,
    });
    // 翻转坐标系
    // 将舞台的y属性设置为舞台高度的值
    stage.y(stage.height());
    // 将舞台的scaleY属性设置为-1，以将y轴正方向朝上
    stage.scaleY(-1);

    const layer = new Konva.Layer();
    stage.add(layer);

    // 给边缘留一点空间用于文字标签
    const GAP_50 = 50;
    const GAP_40 = 40;

    // plot area
    const plotGroup = new Konva.Group({
        x: GAP_40,
        y: GAP_40,
        width: width - GAP_40 * 2,
        height: height - GAP_40 * 2,
    });
    layer.add(plotGroup);

    // 绘制坐标轴
    // const xAxis = new Konva.Line({
    //     points: [0, 0, plotGroup.width(), 0],
    //     stroke: "black",
    //     strokeWidth: 1,
    // });
    // plotGroup.add(xAxis);
    //
    // const yAxis = new Konva.Line({
    //     points: [0, 0, 0, plotGroup.height()],
    //     stroke: "gray",
    //     strokeWidth: 1,
    // });
    // plotGroup.add(yAxis);


    let contentGroup = new Konva.Group({
        x: GAP_50,
        y: GAP_50,
        width: layer.width() - GAP_50 * 2,
        height: layer.height() - GAP_50 * 2,
    });
    layer.add(contentGroup);

    // let bak = new Konva.Rect({
    //     width: contentGroup.width(),
    //     height: contentGroup.height(),
    //     fill: "gray",
    // });

    // let circle1 = new Konva.Circle({
    //     radius: 10,
    //     x: contentGroup.width(),
    //     y: contentGroup.height(),
    //     fill: "red",
    // });
    // let circle2 = new Konva.Circle({
    //     radius: 10,
    //     x: 0,
    //     y: 0,
    //     fill: "red",
    // });

    // contentGroup.add(bak);
    // contentGroup.add(circle1);
    // contentGroup.add(circle2);

    // content area
    // 计算data的y轴范围
    const range = {
        vMin: data[0].data[0],
        vMax: data[0].data[0],
        vpMin: data[0].data[1],
        vpMax: data[0].data[1],
    }
    // 每个小提琴图的宽度
    const width1 = contentGroup.width() / data.length
    // 每个小提琴图之间留出10
    const width2 = width1 - 10
    for (let i = 0; i < data.length; i++) {
        const a = data[i]


        // const ra = new Konva.Rect({
        //     x: i * width1,
        //     y: 0,
        //     width: width1 - 10,
        //     height: contentGroup.height(),
        //     fill: Konva.Util.getRandomColor()
        // })
        // const text = new Konva.Text({
        //     text: a.id,
        //     x: i * width1 + ra.width() / 2,
        //     y: -10,
        //     scaleY: -1
        // })
        // text.offsetX(text.width() / 2)
        // contentGroup.add(text)
        // contentGroup.add(ra)

        for (let j = 0; j < a.data.length; j = j + 2) {
            // 偶数为值
            const v = a.data[j]
            // 奇数为改值的密度
            const vp = a.data[j + 1]
            if (v < range.vMin) {
                range.vMin = v
            }
            if (v > range.vMax) {
                range.vMax = v
            }
            if (vp < range.vpMin) {
                range.vpMin = vp
            }
            if (vp > range.vpMax) {
                range.vpMax = vp
            }
        }
    }
    const vRange = range.vMax - range.vMin
    const vpRange = range.vpMax - range.vpMin
    const yDivide = 10
    // y轴刻度
    for (let i = 0; i <= yDivide; i++) {
        const yText = new Konva.Text({
            text: (vRange / yDivide * i).toFixed(2),
            x: -30,
            y: (i * contentGroup.height() / yDivide),
            scaleY: -1
        })
        contentGroup.add(yText)
    }
    for (let i = 0; i < data.length; i++) {
        const a = data[i]
        // const ra = new Konva.Rect({
        //     x: i * width1,
        //     y: 0,
        //     width: width1 - 10,
        //     height: contentGroup.height(),
        //     fill: Konva.Util.getRandomColor()
        // })
        // contentGroup.add(ra)
        const text = new Konva.Text({
            text: a.id,
            x: i * width1 + width2 / 2,
            y: -10,
            scaleY: -1
        })
        text.offsetX(text.width() / 2 + 10)
        contentGroup.add(text)

        const points = []
        for (let j = 0; j < data[i].data.length; j = j + 2) {

            const y = ((a.data[j] - range.vMin) / vRange) * contentGroup.height()
            const x = ((a.data[j + 1] - range.vpMin) / vpRange) * (width2 / 2) + i * width1 + (width2 / 2)
            points.push(x)
            points.push(y)
            const circle = new Konva.Circle({
                x: i * width1 + width2/2 - Math.random() * 20-20,
                y: y,
                radius: 2,
                fill: Konva.Util.getRandomColor()
            })
            contentGroup.add(circle)


        }
        const line = new Konva.Line({
            points,
            fill: Konva.Util.getRandomColor(),
            stroke: "black",
            strokeWidth: 0,
            closed: true,
        })
        contentGroup.add(line)
    }
}
