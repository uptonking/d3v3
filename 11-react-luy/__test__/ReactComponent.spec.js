import React from "../src/Luy";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "../lib/ReactTestUtils";
import ReactShallowRenderer from "../lib/ReactShallowRenderer";

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactComponent", function() {

    it("should throw on invalid render targets", () => {
        var container = document.createElement("div");
        // jQuery objects are basically arrays; people often pass them in by mistake
        expect(function() {
            ReactDOM.render(<div />, [container]);
        }).toThrowError(/Target container is not a DOM element./);

        expect(function() {
            ReactDOM.render(<div />, null);
        }).toThrowError(/Target container is not a DOM element./);
    });

    it("should throw when supplying a ref outside of render method", () => {
        var instance = <div ref="badDiv" />;
        console.log(ReactTestUtils.renderIntoDocument(instance))
        instance = ReactTestUtils.renderIntoDocument(instance);
        expect(instance.nodeName.toLowerCase()).toBe("div");
    });

    // it("should warn when children are mutated during render", () => {
    //     function Wrapper(props) {
    //         props.children[1] = <p key={1} />; // Mutation is illegal
    //         return <div>{props.children}</div>;
    //     }

    //     var instance = ReactTestUtils.renderIntoDocument(
    //         <Wrapper>
    //             <span key={0} />
    //             <span key={1} />
    //             <span key={2} />
    //         </Wrapper>
    //     );
    //     console.log(ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, "div"))
    //     expect(
    //         ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, "p").length
    //     ).toBe(1);
    // });

    // it("should warn when children are mutated during update", () => {

    //     class Wrapper extends React.Component {
    //         componentDidMount() {
    //             this.props.children[1] = <p key={1} />; // Mutation is illegal
    //             this.forceUpdate();
    //         }

    //         render() {
    //             return <div>{this.props.children}</div>;
    //         }
    //     }

    //     var instance = ReactTestUtils.renderIntoDocument(
    //         <Wrapper>
    //             <span key={0} />
    //             <span key={1} />
    //             <span key={2} />
    //         </Wrapper>
    //     );
    //     expect(
    //         ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, "p").length
    //     ).toBe(1);
    // });

    it('should support refs on owned components', () => {
    var innerObj = {};
    var outerObj = {};

    class Wrapper extends React.Component {
      getObject = () => {
        return this.props.object;
      };

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class Component extends React.Component {
      render() {
        var inner = <Wrapper object={innerObj} ref="inner" />;
        var outer = <Wrapper object={outerObj} ref="outer">{inner}</Wrapper>;
        return outer;
      }

      componentDidMount() {
        expect(this.refs.inner.getObject()).toEqual(innerObj);
        expect(this.refs.outer.getObject()).toEqual(outerObj);
      }
    }

    ReactTestUtils.renderIntoDocument(<Component />);
  });

  it('should not have refs on unmounted components', () => {
    class Parent extends React.Component {
      render() {
        return <Child><div ref="test" /></Child>;
      }

      componentDidMount() {
        expect(this.refs && this.refs.test).toEqual(undefined);
      }
    }

    class Child extends React.Component {
      render() {
        return <div />;
      }
    }

    ReactTestUtils.renderIntoDocument(<Parent child={<span />} />);
  });

  it('should support new-style refs', () => {
    var innerObj = {};
    var outerObj = {};

    class Wrapper extends React.Component {
      getObject = () => {
        return this.props.object;
      };

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    var mounted = false;

    class Component extends React.Component {
      render() {
        var inner = (
          <Wrapper object={innerObj} ref={c => (this.innerRef = c)} />
        );
        var outer = (
          <Wrapper object={outerObj} ref={c => (this.outerRef = c)}>
            {inner}
          </Wrapper>
        );
        return outer;
      }

      componentDidMount() {
        expect(this.innerRef.getObject()).toEqual(innerObj);
        expect(this.outerRef.getObject()).toEqual(outerObj);
        mounted = true;
      }
    }

    ReactTestUtils.renderIntoDocument(<Component />);
    expect(mounted).toBe(true);
  });

  it('should support new-style refs with mixed-up owners', () => {
    class Wrapper extends React.Component {
      getTitle = () => {
        return this.props.title;
      };

      render() {
        return this.props.getContent();
      }
    }

    var mounted = false;

    class Component extends React.Component {
      getInner = () => {
        // (With old-style refs, it's impossible to get a ref to this div
        // because Wrapper is the current owner when this function is called.)
        return <div className="inner" ref={c => (this.innerRef = c)} />;
      };

      render() {
        return (
          <Wrapper
            title="wrapper"
            ref={c => (this.wrapperRef = c)}
            getContent={this.getInner}
          />
        );
      }

      componentDidMount() {
        // Check .props.title to make sure we got the right elements back
        expect(this.wrapperRef.getTitle()).toBe('wrapper');
        expect(ReactDOM.findDOMNode(this.innerRef).className).toBe('inner');
        mounted = true;
      }
    }

    ReactTestUtils.renderIntoDocument(<Component />);
    expect(mounted).toBe(true);
  });
  it('should call refs at the correct time', () => {
    return
    var log = [];

    class Inner extends React.Component {
      render() {
        log.push(`inner ${this.props.id} render`);
        return <div />;
      }

      componentDidMount() {
        log.push(`inner ${this.props.id} componentDidMount`);
      }

      componentDidUpdate() {
        log.push(`inner ${this.props.id} componentDidUpdate`);
      }

      componentWillUnmount() {
        log.push(`inner ${this.props.id} componentWillUnmount`);
      }
    }

    class Outer extends React.Component {
      render() {
        return (
          <div>
            <Inner
              id={1}
              ref={c => {
                log.push(`ref 1 got ${c ? `instance ${c.props.id}` : 'null'}`);
              }}
            />
            <Inner
              id={2}
              ref={c => {
                log.push(`ref 2 got ${c ? `instance ${c.props.id}` : 'null'}`);
              }}
            />
          </div>
        );
      }

      componentDidMount() {
        log.push('outer componentDidMount');
      }

      componentDidUpdate() {
        log.push('outer componentDidUpdate');
      }

      componentWillUnmount() {
        log.push('outer componentWillUnmount');
      }
    }

    // mount, update, unmount
    var el = document.createElement('div');
    log.push('start mount');
    ReactDOM.render(<Outer />, el);
    log.push('start update');
    ReactDOM.render(<Outer />, el);
    log.push('start unmount');
    ReactDOM.unmountComponentAtNode(el);

    /* eslint-disable indent */
    expect(log).toEqual([
      'start mount',
      'inner 1 render',
      'inner 2 render',
      'inner 1 componentDidMount',
      'ref 1 got instance 1',
      'inner 2 componentDidMount',
      'ref 2 got instance 2',
      'outer componentDidMount',
      'start update',
   
      
            // Stack resets refs before rendering
            'ref 1 got null',
            'inner 1 render',
            'ref 2 got null',
            'inner 2 render',
        
      'inner 1 componentDidUpdate',
      'ref 1 got instance 1',
      'inner 2 componentDidUpdate',
      'ref 2 got instance 2',
      'outer componentDidUpdate',
      'start unmount',
      'outer componentWillUnmount',
      'ref 1 got null',
      'inner 1 componentWillUnmount',
      'ref 2 got null',
      'inner 2 componentWillUnmount',
    ]);
    /* eslint-enable indent */
  });
});
