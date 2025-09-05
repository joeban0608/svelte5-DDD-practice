# 多 boundary context (Timeline Boundary & Course Boundary)

## 主要實體（Entities）

- **Timeline**：每個時段可以有多個課程，架設一週 5 天，每天共 3 個時段可以安排課程，共有 15 個時段。
- **Course**：每個課程可加入多位學生。
- **Student**：學生。

## boundary_1 (Timeline.ag (只拿 course.id (timeline 邊界用的到的欄位))> course.en)

- **TimelineAggregate**：每個時段可以有多個課程，架設一週 5 天，每天共 3 個時段可以安排課程，共有 15 個時段。
- **CourseEntity**：每個課程可加入多位學生。

## boundary_2(Course.ag (只拿 student.id (Course 邊界用的到的欄位))> student.en)

- **CourseAggregate**：每個課程可加入多位學生。
- **StudentEntity**：學生。

---
### 結論

- boundary_1 TimelineAggregate > CourseEntity
- boundary_2 CourseAggregate > StudentEntity
- 注意：
  1. boundary_1 與 boundary_2 之間有主從關係，先有 boundary_1 才會有 boundary_2, 因為 boundary_1 沒有建立 Course, boundary_2 沒有課程不能新增 Student
  2. boundary_1 的 CourseEntity 內部與 boundary_2 的 CourseAggregate 內容會不一樣， 對於 boundary_1 的 CourseEntity 不需要知道有關學生的資訊... 等。
