import React from 'react';

import './index.css';

const Publish = ({ onClickClose }) => <div>
  <h3>Publishing a Cast</h3>
  <ol className="instructions">
    <li>
      Fork the <a rel="noreferrer" href="https://github.com/bennyschmidt/ragdoll-studio/tree/master/ragdoll-www-nextjs" target="_blank">Community Site repo</a> from GitHub.
    </li>
    <li>
      If publishing for the first time, create a directory for the name you want to publish under, like this:
      <br />
      <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/</code>
      <br />
      This is where you'll put your published casts moving forward. Create a folder for the cast you want to publish, like this:
      <br />
      <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/YOUR_CAST/</code>
    </li>
    <li>In Ragdoll Studio, <em>Export</em> your cast with the name and cast matching the newly created directories. A JSON file will open in a new tab.</li>
    <li><em>Save Link As...</em> <code>cast.json</code> to the newly created directory in the Community Site fork.</li>
    <li>Your <code>cast.json</code> file path should look like this:
      <br />
      <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/YOUR_CAST/cast.json</code>
      <br />
      You can now open a <a rel="noreferrer" href="https://github.com/bennyschmidt/ragdoll-studio/pulls" target="_blank">Pull Request</a> from your fork to the source repo to commit your changes.</li>
    <li>The approver of the pull request <em>signs</em> your <code>cast.json</code> by appending a <code>createdAt</code> timestamp to the file.</li>
    <li>Once approved and signed, the Pull Request can be merged into <code>master</code> and your cast will appear on the front page of the Community Site momentarily.</li>
  </ol>
  <button onClick={onClickClose}>Close</button>
</div>;

export default Publish;

