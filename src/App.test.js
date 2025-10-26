/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/no-debugging-utils */
import '@testing-library/jest-dom';
import { shallow, mount } from "enzyme";
import { render, screen, act } from "@testing-library/react";
import App from "./App";
import MainNavigation from "./components/layout/MainNavigation";
import Layout from "./components/layout/Layout";
import { useScrollDirection } from "./util-hooks/useScrollDirection";


// HELPER FUNCTIONS

const mockFetchWithMeetupData = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 'm1',
          title: 'Test Meetup',
          image: 'test.jpg',
          address: 'Test Address',
          description: 'Test Description'
        }
      ])
    })
  );
};


const setupE2ETest = async () => {
  render(<App />);
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  return screen.getByRole('banner');
};


const mockPageYOffset = () => {
  const original = Object.getOwnPropertyDescriptor(window, 'pageYOffset');
  
  Object.defineProperty(window, 'pageYOffset', {
    writable: true,
    configurable: true,
    value: 0
  });
  
  return original;
};


const restorePageYOffset = (original) => {
  if (original) {
    Object.defineProperty(window, 'pageYOffset', original);
  } else {
    delete window.pageYOffset;
  }
};

/**
 * Factory funcion to create a ShallowWrapper for the App component
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<App />);
const findByTestAttr = (wrapper, val) => wrapper.find(`[data-test]='${val}'`);

test("renders App without crashing", () => {
  const wrapper = setup();
  //console.log(wrapper.debug());
  expect(wrapper.exists()).toBe(true);
});

test("renders the navigation component", () => {
  const wrapper = setup();
  expect(wrapper.find(MainNavigation).length).toBe(1);
});

test("renders the Layout component", () => {
  const wrapper = setup();
  expect(wrapper.find(Layout).length).toBe(1);
});


// UNIT TEST - useScrollDirection Hook


describe("UNIT TEST - useScrollDirection Hook", () => {

  const TestComponent = () => {
    const { scrollDirection, isVisible } = useScrollDirection();
    return (
      <div>
        <span data-testid="scroll-direction">{scrollDirection || 'null'}</span>
        <span data-testid="is-visible">{isVisible.toString()}</span>
      </div>
    );
  };

  let originalPageYOffset;
  let originalAddEventListener;
  let originalRemoveEventListener;
  let originalRequestAnimationFrame;
  let mockPageYOffset;

  beforeEach(() => {
    originalPageYOffset = Object.getOwnPropertyDescriptor(window, 'pageYOffset');
    originalAddEventListener = window.addEventListener;
    originalRemoveEventListener = window.removeEventListener;
    originalRequestAnimationFrame = window.requestAnimationFrame;

    mockPageYOffset = 0;
    Object.defineProperty(window, 'pageYOffset', {
      get: () => mockPageYOffset,
      configurable: true
    });

    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.requestAnimationFrame = jest.fn(cb => cb());
  });

  afterEach(() => {
    if (originalPageYOffset) {
      Object.defineProperty(window, 'pageYOffset', originalPageYOffset);
    }
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    window.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test("should initialize with correct default values", () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('null');
    expect(screen.getByTestId('is-visible')).toHaveTextContent('true');
  });

  test("should hide header when scrolling down past threshold", () => {
    render(<TestComponent />);
    
    act(() => {
      mockPageYOffset = 150;
      const scrollHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];
      if (scrollHandler) scrollHandler();
      const rafCallback = window.requestAnimationFrame.mock.calls[window.requestAnimationFrame.mock.calls.length - 1]?.[0];
      if (rafCallback) rafCallback();
    });

    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('down');
    expect(screen.getByTestId('is-visible')).toHaveTextContent('false');
  });

  test("should show header when scrolling up", () => {
    render(<TestComponent />);
    act(() => {
      mockPageYOffset = 150;
      const scrollHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];
      if (scrollHandler) scrollHandler();
      const rafCallback = window.requestAnimationFrame.mock.calls[window.requestAnimationFrame.mock.calls.length - 1]?.[0];
      if (rafCallback) rafCallback();
    });

    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('down');
    expect(screen.getByTestId('is-visible')).toHaveTextContent('false');

    act(() => {
      mockPageYOffset = 100;
      const scrollHandler = window.addEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];
      if (scrollHandler) scrollHandler();
      const rafCallback = window.requestAnimationFrame.mock.calls[window.requestAnimationFrame.mock.calls.length - 1]?.[0];
      if (rafCallback) rafCallback();
    });

    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('up');
    expect(screen.getByTestId('is-visible')).toHaveTextContent('true');
  });
});

// E2E TEST - Header Scroll Behavior

describe("E2E TEST - Header Scroll Behavior", () => {
  let originalPageYOffset;
  let originalRequestAnimationFrame;
  let rafCallbacks = [];

  beforeEach(() => {
    mockFetchWithMeetupData();
    originalPageYOffset = mockPageYOffset();
    originalRequestAnimationFrame = window.requestAnimationFrame;

    rafCallbacks = [];
    window.requestAnimationFrame = jest.fn((callback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
  });

  afterEach(() => {
    restorePageYOffset(originalPageYOffset);
    window.requestAnimationFrame = originalRequestAnimationFrame;
    jest.clearAllMocks();
    rafCallbacks = [];
  });

  const simulateScroll = (pageYOffset) => {
    window.pageYOffset = pageYOffset;
    window.dispatchEvent(new Event('scroll'));
    
    rafCallbacks.forEach(callback => callback());
    rafCallbacks = [];
  };

  test("E2E: should show/hide header based on scroll direction in complete app", async () => {
    const header = await setupE2ETest();
    expect(header).toBeInTheDocument();


    expect(header).not.toHaveClass('hidden');

    act(() => {
      simulateScroll(150); 
    });

    expect(header).toHaveClass('hidden');

    act(() => {
      simulateScroll(300);
    });

    expect(header).toHaveClass('hidden');

    act(() => {
      simulateScroll(250); 
    });

    expect(header).not.toHaveClass('hidden');

    act(() => {
      simulateScroll(50);
    });

    expect(header).not.toHaveClass('hidden');

    act(() => {
      simulateScroll(200); 
    });
    expect(header).toHaveClass('hidden');

    act(() => {
      simulateScroll(150); 
    });
    expect(header).not.toHaveClass('hidden');

    act(() => {
      simulateScroll(250); 
    });
    expect(header).toHaveClass('hidden');
  });

  test("E2E: should handle rapid scroll changes correctly", async () => {
    const header = await setupE2ETest();

    act(() => {
      simulateScroll(50);   
      simulateScroll(120);  
      simulateScroll(80);   
      simulateScroll(180);  
      simulateScroll(100);  
    });

    expect(header).not.toHaveClass('hidden');
  });

  test("E2E: should not hide header when scrolling below threshold", async () => {
    const header = await setupE2ETest();

    act(() => {
      simulateScroll(50);
    });

    expect(header).not.toHaveClass('hidden');

    act(() => {
      simulateScroll(90);
    });

    expect(header).not.toHaveClass('hidden');
  });
});

// INTEGRATION TEST - Favorites Flow

describe("INTEGRATION TEST - Favorites Flow", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            id: 'm1',
            title: 'Test Meetup 1',
            image: 'https://example.com/image1.jpg',
            address: 'Test Address 1',
            description: 'Test Description 1'
          },
          {
            id: 'm2', 
            title: 'Test Meetup 2',
            image: 'https://example.com/image2.jpg',
            address: 'Test Address 2',
            description: 'Test Description 2'
          }
        ])
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should manage favorites flow: add favorite and update badge", async () => {
    let wrapper;
    
    await act(async () => {
      wrapper = mount(<App />);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    wrapper.update();

    const initialBadge = wrapper.find('.badge');
    expect(initialBadge.text()).toBe('0');

    const addButton = wrapper.find('button').filterWhere(button => 
      button.text() === 'Add to favorites'
    ).first();
    
    expect(addButton).toHaveLength(1);

    act(() => {
      addButton.simulate('click');
    });
    wrapper.update();

    const updatedBadge = wrapper.find('.badge');
    expect(updatedBadge.text()).toBe('1');

    const removeButton = wrapper.find('button').filterWhere(button => 
      button.text() === 'Remove from favorites'
    );
    expect(removeButton).toHaveLength(1);
  });

  test("should remove favorite and update badge", async () => {
    let wrapper;
    
    await act(async () => {
      wrapper = mount(<App />);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    wrapper.update();

    const addButton = wrapper.find('button').filterWhere(button => 
      button.text() === 'Add to favorites'
    ).first();
    
    act(() => {
      addButton.simulate('click');
    });
    wrapper.update();

    expect(wrapper.find('.badge').text()).toBe('1');

    const removeButton = wrapper.find('button').filterWhere(button => 
      button.text() === 'Remove from favorites'
    ).first();
    
    act(() => {
      removeButton.simulate('click');
    });
    wrapper.update();

    expect(wrapper.find('.badge').text()).toBe('0');

    const newAddButton = wrapper.find('button').filterWhere(button => 
      button.text() === 'Add to favorites'
    );
    expect(newAddButton.length).toBeGreaterThan(0);
  });
});
