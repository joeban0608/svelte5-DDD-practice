## 1. **需求分析**

### user-system | course-system

多重界限上下文（Boundary Context），DDD 設計：

#### 1. 需求分析

- **User 系統（User BC）**
  - 負責「帳號」資訊：`id`, `email`, `password`, `permission`
  - 只處理「誰能登入」及「擁有什麼權限」

- **選課系統（Course BC）**
  - 負責「選/開課流程」與「身份」管理
  - 身份包含：學生、老師、行政（這些屬於「角色」或「身份」）
  - 涵蓋選課、排課、課程管理等業務

#### 2. BC 劃分

- **User BC**：聚焦帳號（身份驗證與授權資料）
- **Course BC**：聚焦課程及「此課程中誰是老師/學生/行政」

#### 3. 身份設計建議

- **身份（Role/Identity）** 在 DDD 中通常不屬於單純的 User 層面，而是屬於「上下文」。
- 同一個 user 在不同 BC 可能有不同身份（如：A 在課程 X 是老師，在課程 Y 是學生，這些身份在 Course BC 表達）

##### User BC 範例

```typescript
export interface UserProps {
  id: UserId;
  email: Email;
  password: HashedPassword;
  permissions: Permission[]; // 例如 ["login", "reset_password"]
}
```

##### Course BC 範例

```typescript
// 課程聚合
export interface CourseProps {
  id: CourseId;
  name: string;
  // ...
}

// 課程與身份的關聯
export interface CourseMemberProps {
  courseId: CourseId;
  userId: UserId;
  identity: 'student' | 'teacher' | 'admin';
}
```

#### 4. 跨 BC 關聯

- Course BC 只保存 `userId`，查詢 user 詳細資料（如 email）時，透過 API 或事件與 User BC 互動
- 身份（student/teacher/admin）是 Course Context 下的狀態，不屬於 user 的本質屬性

#### 5. 設計總結

- **User BC**：user 只負責 account 資訊，permission 可為全域或細部權限
- **Course BC**：課程內的「身份」關係（userId + 身份類型），不混用 user 的 permission
