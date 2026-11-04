# IELTS Speaking 2026 口语练习题库

**在线网站：** [https://seu-prime.github.io/ielts-speaking/](https://seu-prime.github.io/ielts-speaking/)

网站整理了 2026 年 5–8 月与 9–12 月两份雅思口语题库，按 Part、题库批次和考区筛选题目，并为每道题提供简洁的英文练习答案。

答案按题目重新编写，并在学习、统计项目和毕业规划等话题中加入数学系本科生视角。

## 回答时长

IELTS 官方规定口语考试约 11–14 分钟；Part 1 与 Part 3 以考官问答形式进行，Part 2 有 1 分钟准备时间，考生连续陈述 1–2 分钟。官方没有规定每题固定词数。网站示范按常见口语速度设计为：Part 1 每题约 35–50 词、20–25 秒；Part 2 约 200–240 词、约 1 分 40 秒至 2 分钟；Part 3 每题约 55–75 词、30–40 秒。

参考：<https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-speaking-test> · <https://ielts.org/organisers/ielts-scoring-in-detail/ielts-speaking-band-descriptors>

## 功能

- 搜索题目，并按 Part、批次、考区筛选
- 查看 Part 1 简答、Part 2 题卡答案和 Part 3 延伸回答
- 收藏话题，记录个人练习笔记
- 使用限时练习、朗读和复制功能
- 查看题库来源与页码

## 本地预览

在项目目录启动任意静态文件服务器，例如：

```powershell
python -m http.server 4173
```

然后打开 <http://127.0.0.1:4173/>。

## 发布

推送到 `main` 分支后，GitHub Actions 会自动将静态网站发布到 GitHub Pages。题目和练习记录由浏览器本地保存；练习笔记不会上传。
