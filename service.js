/* 业务模块 */

const data = require('./data.json');
const path = require('path');
const fs = require('fs');
const { stringify } = require('querystring');

// 自动生成图书编号
let maxBoookCode = () => {
    let arr = [];
    data.forEach((item) => {
        arr.push(item.id);
    })
    return Math.max.apply(null, arr);
}

// 把内存数据写入文件
let writeDataToFile = (res) => {
    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4), (err) => {
        if (err) {
            res.send('server error');
        }
        // 文件写入成功之后重新跳转到主页面
        res.redirect('/');
    });
}

// 渲染主页面
exports.showIndex = (req, res) => {
    res.render('index', { list: data });
}
// 跳转到添加图书页面
exports.toAddBook = (req, res) => {
    res.render('addBook', {});
}

// 添加图书保存数据
exports.addBook = (req, res) => {
    // 获取表单数据
    let info = req.body;
    let book = {};
    for (let key in info) {
        book[key] = info[key];
    }
    book.id = maxBoookCode() + 1;
    data.push(book);
    // 把内存中的数据写入文件
    writeDataToFile(res);
}

// 跳转到修改页面
exports.toEditBook = (req, res) => {
    let id = req.query.id;
    let book = {};
    data.forEach((item) => {
        if (id == item.id) {
            book = item;
            // 终止运行
            return;
        }
    });
    res.render('editBook', book);
}

// 修改图书提交表单
exports.editBook = (req, res) => {
    let info = req.body;
    data.forEach((item) => {
        if (info.id == item.id) {
            for (let key in info) {
                item[key] = info[key];
            }
            return;//结束循环
        }
    });
    // 把内存中的数据写入文件
    writeDataToFile(res);
}

// 删除图书信息
exports.deleteBook = (req, res) => {
    let id = req.query.id;
    data.forEach((item, index) => {
        if (id == item.id) {
            // 删除数组的一项数据
            data.splice(index, 1);
        }
        return;
    });
    // 把内存中的数据写入文件
    writeDataToFile(res);
}
