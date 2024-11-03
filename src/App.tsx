import './App.css'
import {ChangeEvent, useEffect, useState} from "react";

interface ChildrenData {
    name: string | null
    birthdate: Date | null
}


function loadData(): ChildrenData | null {
    const data = localStorage.getItem("children");
    if (data) {
        const children = JSON.parse(data)
        return {name: children.name, birthdate: children.birthdate ? new Date(children.birthdate) : null}
    }
    return null
}

const SetupForm = () => {
    const [children, setChildren] = useState<ChildrenData>({
        name: null,
        birthdate: null
    })
    return <>
        <form className={"setup-form column"}>
            <div className="row">
                <label style={{width: "35%", textAlign: "left"}} htmlFor={"name"}>Name:</label>
                <input id={"name"} name={"name"} type={"text"}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setChildren({
                           ...children,
                           name: e.target.value
                       })}/>
            </div>
            <div className="row">
                <label style={{width: "35%", textAlign: "left"}} htmlFor={"birthdate"}>Birthdate:</label>
                <input id={"birthdate"} name={"birthdate"} type={"date"}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setChildren({
                           ...children,
                           birthdate: new Date(e.target.value)
                       })}/>
            </div>
            <button type="submit" onClick={() => {
                localStorage.setItem("children", JSON.stringify(children))
            }}>Submit
            </button>
        </form>
    </>
}

interface ChildrenViewProps {
    children: ChildrenData
    durationMetric: 'days' | 'weeks'
}

const ChildrenView = (props: ChildrenViewProps) => {
    // @ts-expect-error: 2362
    const diffInMs = new Date() - props.children.birthdate;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)

    return <>
        {props.durationMetric === 'days' ?
            <h2>Today {props.children.name} is {days} {days > 1 ? 'days' : 'day'} old</h2> :
            <h2>Today {props.children.name} is {weeks} {weeks > 1 ? 'weeks' : 'week'} old</h2>}
    </>
}

function App() {
    const [children, setChildren] = useState<ChildrenData | null>(null)
    const [durationMetric, setDurationMetric] = useState<'days' | 'weeks'>('days')

    useEffect(() => {
        setChildren(loadData())

        const localDurationMetric = localStorage.getItem('durationMetric')
        if (localDurationMetric) {
            setDurationMetric(localDurationMetric as 'days' | 'weeks')
        }
    }, [])

    return (
        <>
            <div className="top-right">
                <div className={'row'} style={{gap: '5px'}}>
                    <button type={"reset"} onClick={() => {
                        localStorage.setItem("children", "")
                        localStorage.setItem('durationMetric', "")
                        setChildren(null)
                    }}>Reset
                    </button>
                    <button style={{width: '7em'}} type={"button"} onClick={() => {
                        console.log(durationMetric)
                        localStorage.setItem('durationMetric', durationMetric)
                        if (durationMetric === 'days') {
                            setDurationMetric('weeks')
                        } else if (durationMetric === 'weeks') {
                            setDurationMetric('days')
                        }
                    }}>{durationMetric == 'days' ? 'In weeks' : 'In days'}</button>
                </div>
            </div>
            <h1>What the age?</h1>
            {children?.birthdate ? <ChildrenView durationMetric={durationMetric} children={children}/> : <SetupForm/>}
        </>
    )
}

export default App
