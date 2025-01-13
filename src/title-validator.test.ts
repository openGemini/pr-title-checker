import { describe, test, expect } from '@jest/globals';

// 修改正则表达式，使用 JavaScript 支持的字符类写法
const pattern = '^(fix|feat|docs|style|refactor|perf|test|build|ci|chore|revert)(\\([^)]+\\))?(!)?: [\\x21-\\x7E]([\\x20-\\x7E]{0,48}[\\x21-\\x7E])?$';

describe('PR Title Validator', () => {
  const regex = new RegExp(pattern);

  // 有效的标题测试用例
  test.each([
    ['feat: add new feature'],
    ['fix(core): resolve memory leak'],
    ['docs(readme): update installation steps'],
    ['feat(api)!: breaking change in API'],
    ['chore: update dependencies'],
    ['fix(auth): implement OAuth2 authentication'],
    ['style(ui): adjust button padding'],
    ['test(api): add integration tests'],
    ['feat: a' + 'b'.repeat(47) + 'c'], // 测试最大长度边界
  ])('should accept valid title: %s', (title) => {
    expect(regex.test(title)).toBe(true);
  });

  // 无效的标题测试用例
  test.each([
    // 类型错误
    ['feature: invalid type'],
    ['fix : space before colon'],
    ['fix:missing space after colon'],
    
    // 范围格式错误
    ['fix(): empty scope'],
    ['fix(scope: missing closing parenthesis'],
    ['fix)scope(: invalid scope format'],
    
    // 内容格式错误
    ['fix: '], // 空内容
    ['fix:  multiple spaces  in  content'], // 多余的空格
    ['fix: ends with space '], // 结尾有空格
    ['fix:  starts with space'], // 开头有空格
    ['fix: 包含中文字符'], // 非ASCII字符
    ['fix: ' + 'a'.repeat(51)], // 超过长度限制
    
    // 特殊字符
    ['fix: contains\nnewline'],
    ['fix: contains\tTab'],
    ['fix: contains\rcarriage return'],
    
    // 完全错误的格式
    ['random text'],
    [''],
    [' '],
  ])('should reject invalid title: %s', (title) => {
    expect(regex.test(title)).toBe(false);
  });

  // 边界情况测试
  describe('edge cases', () => {
    test('title with exactly 50 characters after type', () => {
      const title = 'fix: ' + 'a'.repeat(48) + 'b';
      expect(regex.test(title)).toBe(true);
    });

    test('title with 51 characters after type should fail', () => {
      const title = 'fix: ' + 'a'.repeat(50) + 'b';
      expect(regex.test(title)).toBe(false);
    });

    test('title with special but valid ASCII characters', () => {
      const title = 'fix: Test with @#$%^&*()_+-=[]{}|;:,.<>?';
      expect(regex.test(title)).toBe(true);
    });
  });

  // Breaking change 标记测试
  describe('breaking change marker', () => {
    test('valid breaking change marker', () => {
      expect(regex.test('feat(api)!: breaking change')).toBe(true);
    });

    test('invalid breaking change marker position', () => {
      expect(regex.test('feat!(api): breaking change')).toBe(false);
    });
  });
});
