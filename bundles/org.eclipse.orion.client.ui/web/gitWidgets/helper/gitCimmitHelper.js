/******************************************************************************* 
 * @license
 * Copyright (c) 2011, 2013 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/*eslint-env browser, amd*/
define([
	'orion/git/widgets/gitChangeList',
	'orion/section',
	'orion/selection',
	'orion/webui/littlelib',
	'orion/Deferred',
	'orion/objects'
], function(mGitChangeList, mSection, mSelection, lib, Deferred, objects) {
	
	function GitCimmitHelper(options) {
		this.parentId = options.parentId;
		this.registry = options.registry;
		//this.linkService = options.linkService;
		this.commandService = options.commandService;
		//this.fileClient = options.fileClient;
		this.gitClient = options.gitClient;
		//this.progressService = options.progressService;
		//this.preferencesService = options.preferencesService;
		//this.statusService = options.statusService;
		this.pageNavId = options.pageNavId;
		this.actionScopeId = options.actionScopeId;
	}
	
	objects.mixin(GitCimmitHelper.prototype, /** @lends orion.git.GitCimmitHelper.prototype */ {
		handleError: function(error) {
			var display = {};
			display.Severity = "Error"; //$NON-NLS-0$
			display.HTML = false;
			try {
				var resp = JSON.parse(error.responseText);
				display.Message = resp.DetailedMessage ? resp.DetailedMessage : resp.Message;
			} catch (Exception) {
				display.Message = error.DetailedMessage || error.Message || error.message;
			}
			this.statusService.setProgressResult(display);
			
		},
		destroyDiffs: function() {
			if (this.diffsNavigator) {
				this.diffsNavigator.destroy();
				this.diffsNavigator = null;
			}
			if (this.diffsSection) {
				this.diffsSection.destroy();
				this.diffsSection = null;
			}
		},
		displayDiffs: function(repository, commit, location, commitName, title) {
			this.destroyDiffs();
			var parent = lib.node('table'); //$NON-NLS-0$
			var section = this.diffsSection = new mSection.Section(parent, {
				id : "diffSection", //$NON-NLS-0$
				title : title || messages["CommitChanges"],
				content : '<div id="diffNode"></div>', //$NON-NLS-0$
				canHide : false,
				noTwistie: true,
				preferencesService : this.preferencesService
			});
	
			var explorer = this.diffsNavigator = new mGitChangeList.GitChangeListExplorer({
				serviceRegistry: this.registry,
				commandRegistry: this.commandService,
				selection: null,
				parentId:"diffNode", //$NON-NLS-0$
				actionScopeId: "diffSectionItemActionArea", //$NON-NLS-0$
				prefix: "diff", //$NON-NLS-0$
				repository: repository,
				commit: commit,
				changes: commit ? commit.Diffs : null,
				location: location,
				commitName: commitName,
				section: section,
				gitClient: this.gitClient,
				progressService: this.progressService,
				preferencesService : this.preferencesService,
				handleError: this.handleError.bind(this)
			});
			return explorer.display();
		}
	});
	
	return {
		GitCimmitHelper: GitCimmitHelper
	};
});
