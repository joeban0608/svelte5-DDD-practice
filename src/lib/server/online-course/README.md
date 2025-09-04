# 選課系統

## 單 boundary context

### 主要實體（Entities）

- **Timeline**：每個時段可以有多個課程，架設一週 5 天，每天共 3 個時段可以安排課程，共有 15 個時段。
- **Course**：每個課程可加入多位學生。
- **Student**：學生可選擇多個課程。

### Aggregate 分析

- 一個 Timeline 包含多個 Course。
- 一個 Course 包含多個 Student。

### 結論

## **Timeline**：為最上層實體，適合作為本 bounded context 的 aggregate root。

---

## 多 boundary context (Timeline Boundary & Course Boundary)

### boundary_1 (Timeline.ag (只拿 course.id (timeline 邊界用的到的欄位))> course.en)

### boundary_2(Course.ag (只拿 student.id (Course 邊界用的到的欄位))> student.en)
