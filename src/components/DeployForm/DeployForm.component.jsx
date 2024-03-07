import React, { useState } from 'react'

const DeployForm = () => {
    const [repositoryURL, setRepositoryURL] = useState('')
    const [buildCommand, setBuildCommand] = useState('')
    const [installCommand, setInstallCommand] = useState('')
    const [sentDeploy, setSentDeploy] = useState(false)
    const [deployId, setDeployId] = useState('')
    const [deployStatus, setDeployStatus] = useState('Uploading...')
    const [deployFinished, setDeployFinished] = useState(false)

    const handleRepoUrlChange = (e) => {
        setRepositoryURL(e.target.value)
    }

    const deployApp = async () => {
        setSentDeploy(true)
        console.log(repositoryURL)

        let fetchId = ''

        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/deploy", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                repoUrl: repositoryURL,
                buildCommand: buildCommand,
                installCommand: installCommand
            })
        })
        const data = await response.json()
        if (data.id) {
            setDeployId(data.id)
            fetchId = data.id
        }

        const interval = setInterval(async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/status?id=" + fetchId)
            const data = await response.json()
            setDeployStatus(data.status)
            if (data.status === 'deployed') {
                setDeployFinished(true)
                clearInterval(interval)
            }
        }, 3000)
    }

  return (
    <>
        <div className='flex flex-col items-center justify-center h-full w-full'>
            <form class="max-w-sm mx-auto"> 
                <label for="email" class="block mb-2 text-sm text-gray-900 dark:text-white font-bold">Repository URL</label>
                <input type="url" id="email" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://github.com/jusi-dev/react-boilerplate.git" 
                    disabled={sentDeploy}
                    onChange={(e) => handleRepoUrlChange(e)}
                    value={repositoryURL}
                />
                <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please notice, that your Repository has to be public. Read our <a href="#" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Getting Started</a> for more informations.</p>

                <label for="install-cmd" class="block mb-2 mt-4 text-sm text-gray-900 dark:text-white">Install Command</label>
                <input type="text" id="install-cmd" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="npm i" 
                    disabled={sentDeploy}
                    onChange={(e) => setInstallCommand(e.target.value)}
                    value={installCommand}
                />

                <label for="build-cmd" class="block mb-2 mt-4 text-sm text-gray-900 dark:text-white">Build Command</label>
                <input type="text" id="build-cmd" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="npm run build" 
                    disabled={sentDeploy}
                    onChange={(e) => setBuildCommand(e.target.value)}
                    value={buildCommand}
                />

                {repositoryURL && !sentDeploy
                ? 
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 me-2 mt-4 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={deployApp}>
                        Deploy App
                    </button>
                : sentDeploy && !deployFinished
                ?
                    <button type="button" class="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-4 text-center" disabled>
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                        ({deployId}) {deployStatus}
                    </button>
                : deployFinished
                ?
                    <a href={`http://${deployId}.localhost:3001`} target='_blank'>
                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 me-2 mt-4 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Visit App
                        </button>
                    </a>

                :
                    <button type="button" class="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-4 text-center" disabled>
                        Deploy App
                    </button>
                }
            </form>
        </div>
    </>
  )
}

export default DeployForm