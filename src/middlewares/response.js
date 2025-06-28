const httpStatus = require('http-status');

/**
 * Get success message based on status code
 */
const getSuccessMessage = (statusCode) => {
  switch (statusCode) {
    case httpStatus.OK:
      return 'Success';
    case httpStatus.CREATED:
      return 'Created successfully';
    case httpStatus.NO_CONTENT:
      return 'Deleted successfully';
    case httpStatus.ACCEPTED:
      return 'Accepted';
    default:
      return 'Success';
  }
};

/**
 * Response handler middleware to standardize API responses
 * Format: { status_code, message, data }
 *
 * Cách hoạt động:
 * 1. Override res.send() để intercept tất cả responses
 * 2. Chỉ format response thành công (2xx, 3xx)
 * 3. Bỏ qua response lỗi (4xx, 5xx) - để errorHandler xử lý
 * 4. Sử dụng res.end() cho tất cả trường hợp để tránh lặp vô hạn
 */
const responseHandler = (req, res, next) => {
  // Override res.send
  res.send = function (data) {
    // Chỉ format response thành công (2xx, 3xx)
    if (res.statusCode >= 200 && res.statusCode < 400) {
      // Nếu data đã có format chuẩn, gửi nguyên bản
      if (data && typeof data === 'object' && data.status_code) {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(data));
      }

      // Nếu data có message (từ service), format lại
      if (data && typeof data === 'object' && data.message) {
        const formattedResponse = {
          status_code: res.statusCode,
          message: data.message,
          data: data.data || null,
        };
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(formattedResponse));
      }

      // Format response thành công
      const formattedResponse = {
        status_code: res.statusCode,
        message: getSuccessMessage(res.statusCode),
        data,
      };

      // Sử dụng res.end() để tránh lặp vô hạn
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(formattedResponse));
    }

    // Với response lỗi, gửi nguyên bản bằng res.end()
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  };

  next();
};

module.exports = {
  responseHandler,
};
