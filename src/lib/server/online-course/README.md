Student (聚合根) <---1---< Enrollment >---1---> Course (聚合根)
      |                      |                |
      |  [studentId]         |   [courseId]   |
      |                      |                |
      +----------------------|----------------+
                             |
                         [enrolledAt, status, grade, ...]