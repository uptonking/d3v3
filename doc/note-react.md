# note-react


## history

- 不要在同一个方法连续写两个setState()，异步更新可能只更新一个

## summary

- 高阶组件 Higher-Order Components  
    - 概念   
    高阶组件是一个函数，接收一个组件作为输入，返回一个功能进行处理后的新组件      
    - 多个hoc嵌套的执行顺序 
    `withDefaultProps(withCalSize(withAccessor(withTooltip(PiePlot))));`   
    属性从外层向里传，越来越多  
    - 使用  
        - 高阶组件调用wrapper组件的方法：使用ref    
        ```js
              var Wrapper = (Home) => {
                return React.createClass({
                  render() {
                    return (
                        <div>
                            <button onClick={() => {this.home.someFunc()}} />
                            <Home
                                {...this.props}
                                ref={(c) => this.home = c;}
                            />
                        </div>
                    );
                  }
                })
              }
        ```
    - 注意事项
        - 不要在render()方法中使用高阶组件
        - wrapped组件的静态方法要手动拷贝
        - 避免将高阶组件的refs传递给wrapped组件
    - 实现方法 
        - 属性代理
        - 继承反转
- react mixins 
    - mixins引入了隐式依赖关系
    - 不同mixins的相同方法会导致命名冲突
    - mixins之间相互依赖容易增加复杂度
- 核心
    - 组件声明周期
    - 单向数据流
