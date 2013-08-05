'use strict';

angular.module('sourceService', [])

    .factory('SourceFactory', function ($q, $http) {
        return {
            source: {},
            setSource:function (source) {
                this.source = source;
            },
            getSource:function () {
                return this.source;
            },
            save:function (project) {
                var deferred = $q.defer();
                $http.post("/mlogger/sources", project)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error saving source data: ' + status));
                           });
                return deferred.promise;
            },
            query:function (projectId, sourceId) {
                var deferred = $q.defer();
                $http.get("/mlogger/projects/" + projectId + "/sources/edit/" + sourceId)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error getting source data: ' + status));
                           });
                return deferred.promise;
            },
            queryAll:function (project) {
                var deferred = $q.defer();
                $http.get("/mlogger/projects/" + project._id.$oid + "/sources")
                        .success(function (data) {
                                     deferred.resolve(data);
                                 })
                        .error(function (data, status) {
                                   deferred.reject(new Error('Error loading projects data: ' + status));
                               });
                return deferred.promise;
            },
            update:function (project) {
                var deferred = $q.defer();
                $http.put("/mlogger/sources/update", project)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error updating project data: ' + status));
                           });
                return deferred.promise;
            },
            delete:function (project, source) {
                var deferred = $q.defer();
                $http.delete("/mlogger/projects/" + project._id.$oid + "/sources/delete/" + source._id.$oid)
                    .success(function (data) {
                                 deferred.resolve(data);
                             })
                    .error(function (data, status) {
                               deferred.reject(new Error('Error deleting source data: ' + status));
                           });
                return deferred.promise;
            }
        }
    })

    .value('ProjectDataUtil', {
        findSources:function (treeData) {
            var relationshipsInvolvedInMap = {};
            _.each(treeData.rootProducts, function (rootProduct) {

                if (rootProduct.relationshipsInvolvedIn) {
                    relationshipsInvolvedInMap[rootProduct.id] = rootProduct.relationshipsInvolvedIn.relationships;
                }

                function addChildren(children, relationshipsInvolvedInMap) {
                    _.each(children, function (child) {
                        if (child.relationshipsInvolvedIn) {
                            relationshipsInvolvedInMap[child.id] = child.relationshipsInvolvedIn.relationships;
                        }

                        addChildren(child.children, relationshipsInvolvedInMap);
                    });
                }

                addChildren(rootProduct.children, relationshipsInvolvedInMap);
            });

            return relationshipsInvolvedInMap;
        }
    });