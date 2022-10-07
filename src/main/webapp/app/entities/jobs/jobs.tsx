import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IJobs } from 'app/shared/model/jobs.model';
import { getEntities } from './jobs.reducer';

export const Jobs = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const jobsList = useAppSelector(state => state.jobs.entities);
  const loading = useAppSelector(state => state.jobs.loading);
  const totalItems = useAppSelector(state => state.jobs.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div>
      <h2 id="jobs-heading" data-cy="JobsHeading">
        <Translate contentKey="demoSpringReactApp.jobs.home.title">Jobs</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="demoSpringReactApp.jobs.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/jobs/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="demoSpringReactApp.jobs.home.createLabel">Create new Jobs</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {jobsList && jobsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="demoSpringReactApp.jobs.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('title')}>
                  <Translate contentKey="demoSpringReactApp.jobs.title">Title</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('slug')}>
                  <Translate contentKey="demoSpringReactApp.jobs.slug">Slug</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('featureImage')}>
                  <Translate contentKey="demoSpringReactApp.jobs.featureImage">Feature Image</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('validFrom')}>
                  <Translate contentKey="demoSpringReactApp.jobs.validFrom">Valid From</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('validThrough')}>
                  <Translate contentKey="demoSpringReactApp.jobs.validThrough">Valid Through</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="demoSpringReactApp.jobs.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdBy')}>
                  <Translate contentKey="demoSpringReactApp.jobs.createdBy">Created By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdDate')}>
                  <Translate contentKey="demoSpringReactApp.jobs.createdDate">Created Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updateDate')}>
                  <Translate contentKey="demoSpringReactApp.jobs.updateDate">Update Date</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updateBy')}>
                  <Translate contentKey="demoSpringReactApp.jobs.updateBy">Update By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="demoSpringReactApp.jobs.category">Category</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {jobsList.map((jobs, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/jobs/${jobs.id}`} color="link" size="sm">
                      {jobs.id}
                    </Button>
                  </td>
                  <td>{jobs.title}</td>
                  <td>{jobs.slug}</td>
                  <td>{jobs.featureImage}</td>
                  <td>{jobs.validFrom ? <TextFormat type="date" value={jobs.validFrom} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{jobs.validThrough ? <TextFormat type="date" value={jobs.validThrough} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    <Translate contentKey={`demoSpringReactApp.JobStatus.${jobs.status}`} />
                  </td>
                  <td>{jobs.createdBy}</td>
                  <td>{jobs.createdDate ? <TextFormat type="date" value={jobs.createdDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{jobs.updateDate ? <TextFormat type="date" value={jobs.updateDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{jobs.updateBy}</td>
                  <td>{jobs.category ? <Link to={`/category/${jobs.category.id}`}>{jobs.category.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/jobs/${jobs.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/jobs/${jobs.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/jobs/${jobs.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="demoSpringReactApp.jobs.home.notFound">No Jobs found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={jobsList && jobsList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Jobs;
