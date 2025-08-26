# 🧪 Angular Testing Guide: Jasmine, Karma & TestBed

## 📋 Table of Contents
1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Jasmine Framework](#jasmine-framework)
4. [Karma Test Runner](#karma-test-runner)
5. [Angular TestBed](#angular-testbed)
6. [Testing Examples](#testing-examples)
7. [Running Tests](#running-tests)

## 🎯 Overview

Angular uses a comprehensive testing framework that combines:
- **Jasmine**: Testing framework for writing test specifications
- **Karma**: Test runner that executes tests in browsers
- **TestBed**: Angular's testing utility for configuring and creating test modules

## 🔧 Testing Stack

### Current Configuration in Your Project:

```json
// package.json dependencies
"devDependencies": {
  "@types/jasmine": "~5.1.0",
  "jasmine-core": "~5.6.0",
  "karma": "~6.4.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0"
}
```

## 🧪 Jasmine Framework

### What is Jasmine?
Jasmine is a behavior-driven development (BDD) framework for testing JavaScript code. It provides:
- **Describe blocks**: Group related tests
- **It blocks**: Individual test cases
- **Expectations**: Assertions using `expect()`
- **Spies**: Mock functions and objects
- **Matchers**: Built-in assertion methods

### Key Jasmine Concepts:

```typescript
describe('Service or Component Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialization code
  });

  // Cleanup after each test
  afterEach(() => {
    // Cleanup code
  });

  // Individual test case
  it('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Common Jasmine Matchers:
```typescript
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // Truthy value
expect(value).toBeFalsy();              // Falsy value
expect(value).toContain(item);          // Array/string contains
expect(value).toBeGreaterThan(number);  // Numeric comparison
expect(fn).toThrow();                   // Function throws error
expect(spy).toHaveBeenCalled();         // Spy was called
expect(spy).toHaveBeenCalledWith(args); // Spy called with specific args
```

## 🏃‍♂️ Karma Test Runner

### What is Karma?
Karma is a test runner that:
- Launches browsers (Chrome, Firefox, etc.)
- Serves test files to browsers
- Collects test results
- Provides live reload during development
- Generates coverage reports

### Karma Configuration:
```typescript
// angular.json test configuration
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "assets": ["src/favicon.ico", "src/assets"],
    "styles": ["src/styles.scss"],
    "scripts": []
  }
}
```

## 🔬 Angular TestBed

### What is TestBed?
TestBed is Angular's primary testing utility that:
- Creates a testing module
- Configures dependencies
- Compiles components
- Provides dependency injection
- Manages component lifecycle

### TestBed Configuration:

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      ComponentToTest,           // Standalone component
      ReactiveFormsModule,       // Required modules
      HttpClientTestingModule,   // Mock HTTP client
      NoopAnimationsModule       // Disable animations
    ],
    providers: [
      { provide: ServiceName, useValue: mockService },  // Mock services
      { provide: Router, useValue: mockRouter }         // Mock dependencies
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(ComponentToTest);
  component = fixture.componentInstance;
});
```

## 📝 Testing Examples

### 1. Service Testing (PaymentService):

```typescript
describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });
    
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create order successfully', (done) => {
    service.createOrder(500).subscribe(orderId => {
      expect(orderId).toContain('order_');
      done();
    });
  });
});
```

### 2. Component Testing (BookServiceComponent):

```typescript
describe('BookServiceComponent', () => {
  let component: BookServiceComponent;
  let fixture: ComponentFixture<BookServiceComponent>;
  let mockService: jasmine.SpyObj<SomeService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SomeService', ['method1', 'method2']);
    
    await TestBed.configureTestingModule({
      imports: [BookServiceComponent, RequiredModules],
      providers: [{ provide: SomeService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BookServiceComponent);
    component = fixture.componentInstance;
  });

  it('should select package correctly', () => {
    const testPackage = component.servicePackages[0];
    component.selectPackage(testPackage);
    expect(component.selectedPackage).toBe(testPackage);
  });
});
```

### 3. HTTP Testing:

```typescript
it('should test backend connectivity', () => {
  const mockResponse = { status: 'OK' };

  service.testBackendConnection().subscribe(result => {
    expect(result).toBeTruthy();
  });

  const req = httpMock.expectOne('http://localhost:8085/payments');
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});
```

### 4. Async Testing:

```typescript
it('should handle async operations', async () => {
  const promise = service.asyncMethod();
  const result = await promise;
  expect(result).toBeDefined();
});

it('should handle observables', (done) => {
  service.getObservable().subscribe(data => {
    expect(data).toBeTruthy();
    done();
  });
});
```

## 🚀 Running Tests

### Commands:
```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-reload)
ng test

# Run tests with coverage report
ng test --code-coverage

# Run tests in headless mode (CI/CD)
ng test --watch=false --browsers=ChromeHeadless
```

### Test File Patterns:
- `*.spec.ts` - Test files
- `test-setup.ts` - Global test configuration
- `tsconfig.spec.json` - TypeScript config for tests

## 🎯 Best Practices

### 1. Test Structure (AAA Pattern):
```typescript
it('should do something', () => {
  // Arrange - Set up test data
  const input = 'test';
  
  // Act - Execute the code under test
  const result = component.method(input);
  
  // Assert - Verify the result
  expect(result).toBe('expected');
});
```

### 2. Mock Dependencies:
```typescript
// Create spy objects for dependencies
const mockService = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
mockService.method1.and.returnValue(of('mock data'));
```

### 3. Test Coverage Goals:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### 4. What to Test:
- ✅ Public methods
- ✅ Component interactions
- ✅ Form validations
- ✅ HTTP requests/responses
- ✅ Error handling
- ✅ User interactions

### 5. What NOT to Test:
- ❌ Private methods directly
- ❌ Third-party libraries
- ❌ Angular framework code
- ❌ Simple getters/setters

## 📊 Your Current Test Files

1. **auth.service.spec.ts** - Tests authentication logic
2. **booking.service.spec.ts** - Tests booking operations
3. **payment.service.spec.ts** - Tests payment processing
4. **book-service.component.spec.ts** - Tests booking component

## 🔍 Debugging Tests

### Common Issues:
1. **Async operations**: Use `done()` callback or `async/await`
2. **Missing imports**: Add required modules to TestBed
3. **Dependency injection**: Mock all dependencies
4. **DOM interactions**: Use `fixture.detectChanges()`

### Debug Commands:
```bash
# Run specific test file
ng test --include="**/payment.service.spec.ts"

# Debug in browser
ng test --source-map=true
```

This testing setup ensures your Angular car wash application is robust, maintainable, and bug-free! 🚗✨
