const table = {
  /* 用户 */
  createUser: {
    sql: 'INSERT INTO lego_user(username, password, email) VALUE(?,?,?)'
  },
  updateUserLevel: {
    sql: 'UPDATE lego_user SET power_level = ? WHERE id = ? OR username = ?'
  },
  updateUser: {
    sql: 'UPDATE lego_user SET password = ?, email = ? , activity_ids = ? , page_ids = ? WHERE id = ? OR username = ?'
  },
  getUser: {
    sql: 'SELECT * FROM lego_user WHERE id = ? OR username = ?'
  },
  getUserByUserName: {
    sql: 'SELECT * FROM lego_user WHERE username = ? AND password = ?'
  },
  getUserByEmail: {
    sql: 'SELECT * FROM lego_user WHERE email = ? AND password = ?'
  },
  /* 产品 */
  products: {
    sql: 'SELECT * FROM lego_product;'
  },
  getProductById: {
    sql: 'SELECT * FROM lego_product WHERE id = ?'
  },
  /* 页面 */
  createPage: {
    sql: 'INSERT INTO lego_pages(name, pid, activity_id, deploy_title, deploy_desc, deploy_keywords, creator, editor,root_path) VALUE(?,?,?,?,?,?,?,?,?)'
  },
  updatePage: {
    sql: 'UPDATE lego_pages SET root_path = ? , name = ? , t_name = ? , t_model = ?, sub_path = ?, activity_id = ?, deploy_title = ?, deploy_desc = ?, deploy_keywords = ?, share_title = ?, share_desc = ?, share_img_url = ?, share_link = ?, creator = ?, editor = ? WHERE id = ?'
  },
  getPageById: {
    sql: 'SELECT * FROM lego_pages WHERE id = ? limit 1'
  },
  getPagesByPIdTotal: {
    sql: 'SELECT COUNT(*) as total FROM lego_pages WHERE activity_id = ? AND pid = ? AND is_deleted = 0 AND name LIKE ?'
  },
  getPagesByPId: {
    sql: 'SELECT * FROM lego_pages WHERE activity_id = ? AND pid = ? AND is_deleted = 0 AND name LIKE ? ORDER BY updated_at DESC limit ?, ?'
  },
  getPagesByPIdForSome: {
    sql: 'SELECT id, activity_id, pid, `name`, sub_path, deployed_test, deployed_prod, creator, editor, updated_at FROM lego_pages WHERE activity_id = ? AND pid = ? AND is_deleted = 0 AND name LIKE ? ORDER BY updated_at DESC LIMIT ?, ?'
  },
  getDeletedPages: {
    sql: 'SELECT * FROM lego_pages WHERE is_deleted = 1'
  },
  getPages: {
    sql: 'SELECT * FROM lego_pages WHERE is_deleted = 0'
  },
  deletePage: {
    sql: 'DELETE FROM lego_pages WHERE id = ?'
  },
  markPageValid: {
    sql: 'UPDATE lego_pages SET name = ?, is_deleted = 0, editor = ? WHERE id = ?'
  },
  markPageDeleted: {
    sql: 'UPDATE lego_pages SET name = ?, is_deleted = 1, deployed_test = 0, deployed_prod = 0, sub_path= "", editor = ? WHERE id = ?'
  },
  updatePageConfig: {
    sql: 'UPDATE lego_pages SET name = ?,  sub_path = ?, share_title = ?, share_desc = ?, share_img_url = ?, share_link = ? WHERE id = ?'
  },
  checkSubPathUnique: {
    sql: 'SELECT name FROM lego_pages where pid = ? AND sub_path = ? AND id != ?'
  },
  updateTestDeployState: {
    sql: 'UPDATE lego_pages SET deployed_test = 1 WHERE id = ?'
  },
  updateDeployState: {
    sql: 'UPDATE lego_pages SET deployed_prod = 1 WHERE id = ?'
  },
  /* 活动 */
  getActivityById: {
    sql: 'SELECT * FROM lego_activity WHERE id = ? limit 1'
  },
  getActivitiesTotal: {
    sql: 'SELECT COUNT(*) as total FROM lego_activity WHERE activity_name LIKE ? AND id in(?) AND is_deleted = 0'
  },
  getActivities: {
    sql: 'SELECT * FROM lego_activity WHERE activity_name LIKE ? AND id in(?) AND is_deleted = 0 ORDER BY created_time DESC limit ?, ?'
  },
  getActivitiesTotalNoIds: {
    sql: 'SELECT COUNT(*) as total FROM lego_activity WHERE activity_name LIKE ? AND is_deleted = 0'
  },
  getActivitiesNoIds: {
    sql: 'SELECT * FROM lego_activity WHERE activity_name LIKE ? AND is_deleted = 0 ORDER BY created_time DESC limit ?, ?'
  },
  getDeletedActivities: {
    sql: 'SELECT * FROM lego_activity WHERE is_deleted = 1'
  },
  createActivity: {
    sql: 'INSERT INTO lego_activity(activity_name, activity_level, pre_start_time, pre_end_time, formal_start_time, formal_end_time, creator, editor) VALUE(?,?,?,?,?,?,?,?)'
  },
  updateActivity: {
    sql: 'UPDATE lego_activity SET activity_name = ? , activity_level = ?, pre_start_time = ?, pre_end_time = ?, formal_start_time = ?, formal_end_time = ?, creator = ?, editor = ? WHERE id = ?'
  },
  deleteActivity: {
    sql: 'DELETE FROM lego_activity WHERE id = ?'
  },
  markActivityDeleted: {
    sql: 'UPDATE lego_activity SET activity_name = ?, is_deleted = 1, editor = ? WHERE id = ?'
  },
  markActivityValid: {
    sql: 'UPDATE lego_activity SET activity_name = ?, is_deleted = 0, editor = ? WHERE id = ?'
  }
}

module.exports = table
